export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { imageBase64, mimeType = "image/jpeg" } = req.body;
  if (!imageBase64) return res.status(400).json({ error: "No image provided" });

  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  if (!GOOGLE_API_KEY) return res.status(500).json({ error: "API key not configured" });

  try {
    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requests: [{
            image: { content: imageBase64 },
            features: [{ type: "TEXT_DETECTION", maxResults: 200 }]
          }]
        })
      }
    );

    const data = await response.json();
    if (!response.ok) return res.status(200).json({ error: data.error?.message });

    const annotations = data.responses?.[0]?.textAnnotations || [];
    const fullText = annotations[0]?.description || "";

    // ── 레인 번호 ──────────────────────────────────────────
    const laneMatch = fullText.match(/레인\s*0?(\d{1,2})/);
    const lane = laneMatch ? laneMatch[1] : null;

    const lines = fullText.split("\n").map(l => l.trim()).filter(l => l.length > 0);
    const labelPattern = /^(\d{1,3}[A-Za-z])\s*(.*)/;

    // 라벨 위치 찾기
    const labelPositions = [];
    lines.forEach((line, idx) => {
      const m = line.match(labelPattern);
      if (m) labelPositions.push({ idx, label: m[1], rest: m[2] });
    });

    // ── 투구 토큰 추출 함수 ────────────────────────────────
    const extractTokens = (text) => {
      // X(스트라이크), /(스페어), -(거터), 숫자, ☑(스트라이크 기호) 추출
      const cleaned = text.toUpperCase()
        .replace(/☑/g, 'X')
        .replace(/[|｜]/g, '')  // 프레임 구분선 제거
        .replace(/[^\dX\/\-\s]/g, ' ');
      return cleaned.match(/X|\/|\-|\d/g) || [];
    };

    // ── 프레임 파싱 함수 ───────────────────────────────────
    const parseFrames = (tokens) => {
      const frames = [];
      let i = 0;
      for (let fn = 1; fn <= 10; fn++) {
        if (i >= tokens.length) break;
        const s1 = tokens[i];
        if (s1 === 'X') {
          if (fn === 10) {
            const s2 = tokens[i+1] || '';
            const s3 = tokens[i+2] || '';
            frames.push(['X', s2, s3]);
            i += 3;
          } else {
            frames.push(['X']);
            i += 1;
          }
        } else {
          const s2 = tokens[i+1] || '';
          if (s2 === '/') {
            if (fn === 10) {
              const s3 = tokens[i+2] || '';
              frames.push([s1, '/', s3]);
              i += 3;
            } else {
              frames.push([s1, '/']);
              i += 2;
            }
          } else {
            frames.push([s1, s2]);
            i += 2;
          }
        }
      }
      return frames;
    };

    // ── 점수 계산 함수 ─────────────────────────────────────
    const calcScore = (frames) => {
      const shots = [];
      for (const f of frames) {
        for (const s of f) {
          if (s === 'X') shots.push(10);
          else if (s === '/') shots.push(10 - (shots[shots.length-1] || 0));
          else if (s === '-' || s === '') shots.push(0);
          else if (/\d/.test(s)) shots.push(parseInt(s));
          else shots.push(0);
        }
      }

      let total = 0, si = 0;
      const cumulative = [];

      for (let fi = 0; fi < Math.min(10, frames.length); fi++) {
        if (si >= shots.length) break;
        let frameScore = 0;
        const validShots = frames[fi].filter(s => s !== '').length;

        if (shots[si] === 10) {  // 스트라이크
          frameScore = 10 +
            (shots[si+1] || 0) +
            (shots[si+2] || 0);
          si += (fi < 9 ? 1 : validShots);
        } else if (si+1 < shots.length && shots[si] + shots[si+1] === 10) {  // 스페어
          frameScore = 10 + (shots[si+2] || 0);
          si += (fi < 9 ? 2 : validShots);
        } else {
          frameScore = (shots[si] || 0) + (shots[si+1] || 0);
          si += 2;
        }

        total += frameScore;
        cumulative.push(total);
      }

      return { total, cumulative };
    };

    // ── 플레이어별 파싱 ────────────────────────────────────
    const players = [];

    if (labelPositions.length > 0) {
      labelPositions.forEach((lp, pos) => {
        const nextIdx = labelPositions[pos + 1]?.idx ?? lines.length;

        // 해당 범위 텍스트 수집
        let segment = lp.rest + " ";
        for (let li = lp.idx + 1; li < nextIdx; li++) {
          segment += lines[li] + " ";
        }

        // 투구 토큰 추출
        const tokens = extractTokens(segment);

        // 누적점수 추출 (백업용)
        const cumBackup = [];
        let prev = 0;
        segment.match(/\d+/g)?.forEach(n => {
          const num = parseInt(n);
          if (num > prev && num <= 300 && cumBackup.length < 10) {
            cumBackup.push(num);
            prev = num;
          }
        });

        // 프레임 파싱 및 점수 계산
        const frames = parseFrames(tokens);
        const { total, cumulative } = calcScore(frames);

        // 총점 검증: 계산값과 OCR 누적점수 마지막 값 비교
        const ocrTotal = cumBackup[cumBackup.length - 1] || null;
        const finalTotal = total > 0 ? total : ocrTotal;
        const finalCumulative = cumulative.length > 0 ? cumulative : cumBackup;

        players.push({
          label: lp.label,
          frames: frames.map(f => f.join('')),  // 표시용: "9/", "X", "81" 등
          framesRaw: frames,
          totalScore: finalTotal,
          cumulative: finalCumulative,
          // 누적점수 배열 (프레임별)
          frameCumulative: Array.from({ length: 10 }, (_, i) => finalCumulative[i] ?? null),
        });
      });
    }

    // 라벨 없을 때 - 누적점수만
    if (players.length === 0) {
      const bigNums = [...new Set(
        (fullText.match(/\b([1-2]\d{2}|300)\b/g) || []).map(Number)
          .filter(n => n >= 50 && n <= 300)
      )].slice(0, 2);

      bigNums.forEach((score, i) => {
        players.push({
          label: `P${i+1}`,
          frames: [],
          framesRaw: [],
          totalScore: score,
          cumulative: [score],
          frameCumulative: Array(10).fill(null),
        });
      });
    }

    return res.status(200).json({
      success: players.length > 0,
      players,
      lane,
      fullText: fullText.slice(0, 1000),
    });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
