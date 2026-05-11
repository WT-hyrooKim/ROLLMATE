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

    // ── 투구 기호 추출 ─────────────────────────────────────
    const extractShots = (text) => {
      return text.toUpperCase()
        .replace(/☑/g, 'X')
        .replace(/[|｜]/g, ' ')
        .match(/X|\/|\-|\d/g) || [];
    };

    // ── 프레임 파싱 (기호만, 계산 없음) ───────────────────
    const parseFrames = (tokens) => {
      const frames = [];
      let i = 0;
      for (let fn = 1; fn <= 10 && i < tokens.length; fn++) {
        const s1 = tokens[i];
        if (s1 === 'X') {
          if (fn === 10) {
            frames.push({ shots: ['X', tokens[i+1]||'', tokens[i+2]||''], isStrike:true });
            i += 3;
          } else {
            frames.push({ shots: ['X'], isStrike: true });
            i += 1;
          }
        } else {
          const s2 = tokens[i+1] || '';
          if (s2 === '/') {
            if (fn === 10) {
              frames.push({ shots: [s1, '/', tokens[i+2]||''], isSpare:true });
              i += 3;
            } else {
              frames.push({ shots: [s1, '/'], isSpare: true });
              i += 2;
            }
          } else {
            frames.push({ shots: [s1, s2] });
            i += 2;
          }
        }
      }
      return frames;
    };

    // ── 플레이어별 파싱 ────────────────────────────────────
    const players = [];

    if (labelPositions.length > 0) {
      labelPositions.forEach((lp, pos) => {
        const nextIdx = labelPositions[pos + 1]?.idx ?? lines.length;

        // 해당 범위 텍스트
        let segment = lp.rest + " ";
        for (let li = lp.idx + 1; li < nextIdx; li++) {
          segment += lines[li] + " ";
        }

        // 누적점수 추출 (오름차순)
        const cumScores = [];
        let prev = 0;
        (segment.match(/\d+/g) || []).forEach(n => {
          const num = parseInt(n);
          if (num > prev && num <= 300 && cumScores.length < 10) {
            cumScores.push(num);
            prev = num;
          }
        });

        // 투구 기호 추출
        const tokens = extractShots(segment);
        const frames = parseFrames(tokens);

        // 총점 = 누적점수 마지막 값
        const totalScore = cumScores[cumScores.length - 1] || null;

        // 프레임별 누적점수 (10개)
        const frameCumulative = Array.from({ length: 10 }, (_, f) => cumScores[f] ?? null);

        players.push({
          label: lp.label,
          frames,           // 투구 기호 배열
          frameCumulative,  // 프레임별 누적점수
          totalScore,
          cumScores,
        });
      });
    }

    // 라벨 없을 때
    if (players.length === 0) {
      const bigNums = [...new Set(
        (fullText.match(/\b([1-2]\d{2}|300)\b/g) || []).map(Number)
          .filter(n => n >= 50 && n <= 300)
      )].slice(0, 2);
      bigNums.forEach((score, i) => {
        players.push({
          label: `P${i+1}`,
          frames: [],
          frameCumulative: Array(10).fill(null),
          totalScore: score,
          cumScores: [score],
        });
      });
    }

    return res.status(200).json({
      success: players.length > 0,
      players, lane,
      fullText: fullText.slice(0, 1000),
    });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
