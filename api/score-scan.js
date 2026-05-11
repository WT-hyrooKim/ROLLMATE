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

    // ── 라인 단위 파싱 ─────────────────────────────────────
    const lines = fullText.split("\n").map(l => l.trim()).filter(l => l.length > 0);
    const labelPattern = /^(\d{1,3}[A-Za-z])\s*(\d*)/;

    // 라벨 위치 찾기
    const labelPositions = [];
    lines.forEach((line, idx) => {
      const m = line.match(labelPattern);
      if (m) labelPositions.push({ idx, label: m[1], firstStr: m[2] });
    });

    const players = [];

    if (labelPositions.length > 0) {
      labelPositions.forEach((lp, pos) => {
        const nextIdx = labelPositions[pos + 1]?.idx ?? lines.length;

        // 해당 라벨 ~ 다음 라벨 사이 모든 숫자 수집
        const allNums = [];
        if (lp.firstStr) {
          const n = parseInt(lp.firstStr);
          if (n >= 1 && n <= 300) allNums.push(n);
        }
        for (let li = lp.idx + 1; li < nextIdx; li++) {
          const numsInLine = lines[li].match(/\d+/g)?.map(Number) || [];
          numsInLine.forEach(n => {
            if (n >= 1 && n <= 300) allNums.push(n);
          });
        }

        // 오름차순 필터 (누적점수 특성)
        const cumScores = [];
        let prev = 0;
        for (const n of allNums) {
          if (n > prev && n <= 300 && cumScores.length < 10) {
            cumScores.push(n);
            prev = n;
          }
        }

        const totalScore = cumScores.length > 0 ? cumScores[cumScores.length - 1] : null;
        const frames = Array.from({ length: 10 }, (_, f) => cumScores[f] ?? null);

        players.push({ label: lp.label, frames, totalScore, cumulative: cumScores });
      });
    } else {
      // 라벨 없을 때 - 100~300 숫자 중 최대 2개
      const bigNums = [...new Set(
        (fullText.match(/\b([1-2]\d{2}|300)\b/g) || []).map(Number)
          .filter(n => n >= 100 && n <= 300)
      )].slice(0, 2);

      bigNums.forEach((score, i) => {
        players.push({
          label: `P${i + 1}`,
          frames: Array(10).fill(null),
          totalScore: score,
          cumulative: [score],
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
