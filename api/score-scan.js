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
            features: [
              { type: "TEXT_DETECTION", maxResults: 200 },
              { type: "DOCUMENT_TEXT_DETECTION" }
            ]
          }]
        })
      }
    );

    const data = await response.json();
    if (!response.ok) return res.status(200).json({ error: data.error?.message });

    const annotations = data.responses?.[0]?.textAnnotations || [];
    const fullText = annotations[0]?.description || "";

    // ── 위치 정보 포함 블록 ────────────────────────────────
    const blocks = annotations.slice(1).map(a => ({
      text: a.description,
      x: Math.round(a.boundingPoly?.vertices?.[0]?.x || 0),
      y: Math.round(a.boundingPoly?.vertices?.[0]?.y || 0),
      x2: Math.round(a.boundingPoly?.vertices?.[2]?.x || 0),
      y2: Math.round(a.boundingPoly?.vertices?.[2]?.y || 0),
    }));

    const maxX = Math.max(...blocks.map(b => b.x2), 1);
    const maxY = Math.max(...blocks.map(b => b.y2), 1);

    // ── 레인 번호 ──────────────────────────────────────────
    const laneMatch = fullText.match(/레인\s*0?(\d{1,2})/);
    const lane = laneMatch ? laneMatch[1] : null;

    const lines = fullText.split("\n").map(l => l.trim()).filter(l => l.length > 0);

    // ── 플레이어 라벨 찾기 ─────────────────────────────────
    const labelPattern = /^(\d{1,3}[A-Za-z])$/;
    const labelLinePattern = /^(\d{1,3}[A-Za-z])\s+(.*)/;

    const labelPositions = [];
    lines.forEach((line, idx) => {
      const m1 = line.match(labelLinePattern);
      const m2 = line.match(labelPattern);
      if (m1) labelPositions.push({ idx, label: m1[1], rest: m1[2] });
      else if (m2) labelPositions.push({ idx, label: m2[1], rest: "" });
    });

    // ── 총점 추출 (위치 기반: 이미지 오른쪽 끝 큰 숫자) ───
    const rightThreshold = maxX * 0.6;
    const totalBlocks = blocks
      .filter(b => {
        const n = parseInt(b.text);
        return /^\d{2,3}$/.test(b.text) && n >= 50 && n <= 300 && b.x > rightThreshold;
      })
      .sort((a, b) => a.y - b.y);

    // ── 투구 기호 파싱 ─────────────────────────────────────
    const extractShots = (text) => {
      return text.toUpperCase()
        .replace(/☑/g, 'X')
        .replace(/[|｜▶◀►◄→←]/g, ' ')
        .match(/X|\/|\-|\d/g) || [];
    };

    const parseFrames = (tokens) => {
      const frames = [];
      let i = 0;
      for (let fn = 1; fn <= 10 && i < tokens.length; fn++) {
        const s1 = tokens[i];
        if (s1 === 'X') {
          if (fn === 10) {
            frames.push({ fn, shots: ['X', tokens[i+1]||'', tokens[i+2]||''], isStrike:true });
            i += 3;
          } else {
            frames.push({ fn, shots: ['X'], isStrike:true });
            i++;
          }
        } else {
          const s2 = tokens[i+1] || '';
          if (s2 === '/') {
            if (fn === 10) {
              frames.push({ fn, shots:[s1,'/',tokens[i+2]||''], isSpare:true });
              i += 3;
            } else {
              frames.push({ fn, shots:[s1,'/'], isSpare:true });
              i += 2;
            }
          } else {
            frames.push({ fn, shots:[s1, s2] });
            i += 2;
          }
        }
      }
      return frames;
    };

    // ── 누적점수 추출 ──────────────────────────────────────
    const extractCumulative = (text) => {
      const nums = [];
      let prev = 0;
      (text.match(/\d+/g) || []).forEach(n => {
        const num = parseInt(n);
        if (num > prev && num <= 300 && nums.length < 10) {
          nums.push(num);
          prev = num;
        }
      });
      return nums;
    };

    // ── 플레이어별 파싱 ────────────────────────────────────
    const players = [];

    if (labelPositions.length > 0) {
      labelPositions.forEach((lp, pos) => {
        const nextIdx = labelPositions[pos+1]?.idx ?? lines.length;

        // 해당 범위 텍스트
        let segment = lp.rest + " ";
        for (let li = lp.idx+1; li < nextIdx; li++) {
          segment += lines[li] + " ";
        }

        // 투구 기호
        const tokens = extractShots(segment);
        const parsedFrames = parseFrames(tokens);

        // 누적점수
        const cumScores = extractCumulative(segment);

        // 총점: 오른쪽 끝 큰 숫자 (해당 라벨 Y범위)
        const labelBlock = blocks.find(b => b.text === lp.label);
        const labelY = labelBlock?.y || (pos * (maxY / Math.max(labelPositions.length, 1)));
        const nextLabelY = labelPositions[pos+1]
          ? (blocks.find(b => b.text === labelPositions[pos+1].label)?.y || maxY)
          : maxY;

        const rowTotal = totalBlocks.find(b => b.y >= labelY - 30 && b.y < nextLabelY + 30);
        const ocrTotal = rowTotal ? parseInt(rowTotal.text) : null;

        // 총점 결정: 오른쪽 끝 숫자 우선, 없으면 누적 마지막
        const totalScore = ocrTotal || (cumScores.length > 0 ? cumScores[cumScores.length-1] : null);

        // 누적점수 → 10프레임 배열로
        // 진행 중인 게임: 일부만 있음
        // 총점 기준으로 누적점수의 마지막이 총점과 같아야 함
        let finalCum = [...cumScores];
        if (totalScore && finalCum[finalCum.length-1] !== totalScore) {
          // 총점이 누적에 없으면 추가
          if (totalScore > (finalCum[finalCum.length-1] || 0)) {
            finalCum.push(totalScore);
          }
        }

        // 10프레임 배열 (없는 프레임은 null)
        // 누적점수가 뒤에서부터 채워진 경우 (진행 중)
        // → 총프레임수로 역산
        const frameCount = finalCum.length;
        const startFrame = 10 - frameCount; // 빈 프레임 수

        const frameCumulative = Array.from({length:10}, (_, f) => {
          if (f < startFrame) return null; // 빈 프레임
          const cumIdx = f - startFrame;
          return finalCum[cumIdx] ?? null;
        });

        // 투구 기호도 startFrame에 맞춰 배치
        const frameShots = Array.from({length:10}, (_, f) => {
          if (f < startFrame) return null;
          const fi = f - startFrame;
          return parsedFrames[fi] || null;
        });

        players.push({
          label: lp.label,
          frameShots,       // null=빈프레임
          frameCumulative,  // null=빈프레임
          totalScore,
          startFrame,       // 몇 번 프레임부터 시작하는지
        });
      });
    }

    // 라벨 없을 때
    if (players.length === 0) {
      const bigNums = [...new Set(
        (fullText.match(/\b([1-2]\d{2}|300)\b/g)||[]).map(Number).filter(n=>n>=50&&n<=300)
      )].slice(0,2);
      bigNums.forEach((score,i)=>{
        players.push({
          label:`P${i+1}`,
          frameShots:Array(10).fill(null),
          frameCumulative:Array(10).fill(null),
          totalScore:score,
          startFrame:0,
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
