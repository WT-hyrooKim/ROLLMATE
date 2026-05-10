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

    // 위치 정보 포함 블록
    const blocks = annotations.slice(1).map(a => ({
      text: a.description,
      x: Math.round(a.boundingPoly?.vertices?.[0]?.x || 0),
      y: Math.round(a.boundingPoly?.vertices?.[0]?.y || 0),
      x2: Math.round(a.boundingPoly?.vertices?.[2]?.x || 0),
      y2: Math.round(a.boundingPoly?.vertices?.[2]?.y || 0),
      w: Math.round((a.boundingPoly?.vertices?.[2]?.x || 0) - (a.boundingPoly?.vertices?.[0]?.x || 0)),
      h: Math.round((a.boundingPoly?.vertices?.[2]?.y || 0) - (a.boundingPoly?.vertices?.[0]?.y || 0)),
    }));

    const maxX = Math.max(...blocks.map(b => b.x2), 1);
    const maxY = Math.max(...blocks.map(b => b.y2), 1);

    // ── 레인 번호 ──────────────────────────────────────────
    const laneMatch = fullText.match(/레인\s*0?(\d{1,2})/);
    const lane = laneMatch ? laneMatch[1] : null;

    // ── 총점 추출 전략 ─────────────────────────────────────
    // 전광판 총점은 보통 오른쪽 끝에 큰 폰트로 표시
    // 크기가 크고 오른쪽에 위치한 숫자 = 총점
    const rightEdge = maxX * 0.65;

    // 큰 숫자 블록 (총점 후보)
    // 폰트 크기 = 블록 높이로 추정
    const bigNumBlocks = blocks
      .filter(b => {
        const num = parseInt(b.text);
        return /^\d{2,3}$/.test(b.text) &&
          num >= 50 && num <= 300 &&
          b.x > rightEdge;
      })
      .sort((a, b) => {
        // 더 크고 오른쪽에 있는 것 우선
        const sizeA = a.w * a.h;
        const sizeB = b.w * b.h;
        return sizeB - sizeA;
      });

    // ── 플레이어 라벨 ──────────────────────────────────────
    const labelBlocks = blocks
      .filter(b => /^\d{1,3}[A-Za-z]$/.test(b.text))
      .sort((a, b) => a.y - b.y);

    // ── 누적점수 추출 ──────────────────────────────────────
    // 중앙 영역의 숫자들 (프레임 누적점수)
    const midNums = blocks
      .filter(b => {
        const num = parseInt(b.text);
        return /^\d{1,3}$/.test(b.text) &&
          num >= 1 && num <= 300 &&
          b.x < rightEdge;
      })
      .sort((a, b) => a.y - b.y || a.x - b.x);

    // ── 플레이어별 파싱 ────────────────────────────────────
    const players = [];

    if (labelBlocks.length > 0) {
      labelBlocks.forEach((label, i) => {
        const nextLabel = labelBlocks[i + 1];
        const rowY1 = label.y - 30;
        const rowY2 = nextLabel ? nextLabel.y - 30 : label.y + maxY * 0.3;

        // 해당 행의 누적점수
        const rowNums = midNums
          .filter(b => b.y >= rowY1 && b.y < rowY2)
          .sort((a, b) => a.x - b.x)
          .map(b => parseInt(b.text));

        // 누적점수 필터 (오름차순 유지)
        const cumScores = [];
        let prev = 0;
        for (const n of rowNums) {
          if (n > prev && n <= 300) {
            cumScores.push(n);
            prev = n;
          }
        }

        // 총점: 해당 행의 오른쪽 큰 숫자
        const rowTotal = bigNumBlocks.find(b => b.y >= rowY1 && b.y < rowY2);
        const totalScore = rowTotal
          ? parseInt(rowTotal.text)
          : (cumScores.length > 0 ? cumScores[cumScores.length - 1] : null);

        // 프레임 배열
        const frames = Array.from({ length: 10 }, (_, f) => cumScores[f] ?? null);

        players.push({
          label: label.text,
          frames,
          totalScore,
          cumulative: cumScores,
        });
      });
    } else {
      // 라벨 없을 때 - 총점만 추출
      bigNumBlocks.slice(0, 2).forEach((b, i) => {
        players.push({
          label: `P${i + 1}`,
          frames: Array(10).fill(null),
          totalScore: parseInt(b.text),
          cumulative: [],
        });
      });
    }

    // 결과 없으면 fullText에서 큰 숫자 추출
    if (players.length === 0) {
      const nums = (fullText.match(/\d{2,3}/g) || [])
        .map(Number)
        .filter(n => n >= 50 && n <= 300);

      if (nums.length > 0) {
        players.push({
          label: "P1",
          frames: Array(10).fill(null),
          totalScore: Math.max(...nums),
          cumulative: nums,
        });
      }
    }

    return res.status(200).json({
      success: true,
      players,
      lane,
      fullText: fullText.slice(0, 1000),
    });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
