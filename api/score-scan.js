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
    // Cloud Vision OCR
    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requests: [{
            image: { content: imageBase64 },
            features: [
              { type: "TEXT_DETECTION", maxResults: 50 },
            ]
          }]
        })
      }
    );

    const data = await response.json();
    if (!response.ok) return res.status(200).json({ error: data.error?.message });

    const fullText = data.responses?.[0]?.textAnnotations?.[0]?.description || "";
    const annotations = data.responses?.[0]?.textAnnotations || [];

    // 텍스트 블록들 (위치 정보 포함)
    const blocks = annotations.slice(1).map(a => ({
      text: a.description,
      y: a.boundingPoly?.vertices?.[0]?.y || 0,
      x: a.boundingPoly?.vertices?.[0]?.x || 0,
    }));

    // 플레이어 행 감지 (53A, 53B 등 레인번호+알파벳 패턴)
    const playerLabels = blocks
      .filter(b => /^\d{1,3}[A-Z]$/.test(b.text))
      .sort((a, b) => a.y - b.y);

    // 총점 추출 - 큰 숫자 (100~300 범위)
    const bigNumbers = blocks
      .filter(b => /^\d{2,3}$/.test(b.text) && parseInt(b.text) >= 50 && parseInt(b.text) <= 300)
      .sort((a, b) => a.y - b.y);

    // 레인 번호 추출
    const laneMatch = fullText.match(/레인\s*(\d{2})/);
    const lane = laneMatch ? laneMatch[1] : null;

    // 날짜 추출 시도
    const dateMatch = fullText.match(/(\d{4})[.\-\/](\d{1,2})[.\-\/](\d{1,2})/);
    const date = dateMatch
      ? `${dateMatch[1]}-${dateMatch[2].padStart(2,"0")}-${dateMatch[3].padStart(2,"0")}`
      : null;

    // 플레이어별 점수 파싱
    const players = [];

    if (playerLabels.length > 0) {
      // 각 플레이어 행의 Y범위로 숫자 분류
      const rowHeight = 80; // 대략적인 행 높이
      playerLabels.forEach((pl, i) => {
        const nextY = playerLabels[i+1]?.y || pl.y + rowHeight * 3;
        const rowNums = bigNumbers
          .filter(b => b.y >= pl.y - rowHeight && b.y < nextY - rowHeight)
          .sort((a, b) => a.x - b.x)
          .map(b => parseInt(b.text));

        // 누적점수 배열에서 프레임별 점수 파싱
        // 볼링 점수판은 누적점수로 표시
        const cumulative = rowNums;
        const frames = [];
        for (let f = 0; f < 10; f++) {
          frames.push(cumulative[f] || null);
        }

        const totalScore = cumulative[cumulative.length - 1] || null;

        players.push({
          label: pl.text,
          frames,
          totalScore,
          cumulative,
        });
      });
    } else {
      // 플레이어 라벨 없이 숫자만 추출
      const nums = bigNumbers.sort((a,b)=>a.y-b.y||a.x-b.x).map(b=>parseInt(b.text));
      players.push({
        label: "P1",
        frames: nums.slice(0, 10),
        totalScore: nums[nums.length-1] || null,
        cumulative: nums,
      });
    }

    return res.status(200).json({
      success: true,
      players,
      lane,
      date,
      fullText: fullText.slice(0, 500),
    });

  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}
