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
    if (!annotations.length) return res.status(200).json({ error: "텍스트를 인식하지 못했어요" });

    const fullText = annotations[0].description;

    // 위치 정보 포함한 블록 추출
    const blocks = annotations.slice(1).map(a => ({
      text: a.description,
      x: Math.round(a.boundingPoly?.vertices?.[0]?.x || 0),
      y: Math.round(a.boundingPoly?.vertices?.[0]?.y || 0),
      x2: Math.round(a.boundingPoly?.vertices?.[2]?.x || 0),
      y2: Math.round(a.boundingPoly?.vertices?.[2]?.y || 0),
    }));

    // 이미지 전체 높이 추정
    const maxY = Math.max(...blocks.map(b => b.y2));
    const maxX = Math.max(...blocks.map(b => b.x2));

    // ── 1. 레인 번호 추출 ──────────────────────────────────
    const laneMatch = fullText.match(/레인\s*0?(\d{1,2})/);
    const lane = laneMatch ? laneMatch[1] : null;

    // ── 2. 플레이어 라벨 추출 ─────────────────────────────
    // 53A, 53B 또는 숫자+알파벳 패턴
    const labelBlocks = blocks.filter(b => /^\d{1,3}[A-Za-z]$/.test(b.text));

    // ── 3. 총점 추출 ──────────────────────────────────────
    // 오른쪽 끝 큰 숫자 (총점은 보통 이미지 오른쪽에 크게 표시)
    const rightThreshold = maxX * 0.7;
    const scoreBlocks = blocks.filter(b =>
      /^\d{2,3}$/.test(b.text) &&
      parseInt(b.text) >= 50 &&
      parseInt(b.text) <= 300 &&
      b.x > rightThreshold
    ).sort((a,b) => a.y - b.y);

    // ── 4. 누적점수 추출 (중간 영역 숫자들) ─────────────────
    // 볼링 전광판에서 프레임 누적점수는 중간 영역에 표시
    const midBlocks = blocks.filter(b =>
      /^\d{1,3}$/.test(b.text) &&
      parseInt(b.text) >= 1 &&
      parseInt(b.text) <= 300
    ).sort((a,b) => a.y - b.y || a.x - b.x);

    // ── 5. 플레이어별 파싱 ────────────────────────────────
    const players = [];

    if (labelBlocks.length >= 1) {
      // 라벨 Y좌표 기준으로 행 나누기
      const sortedLabels = labelBlocks.sort((a,b) => a.y - b.y);

      sortedLabels.forEach((label, i) => {
        const rowY1 = label.y - 20;
        const rowY2 = sortedLabels[i+1] ? sortedLabels[i+1].y - 20 : label.y + (maxY * 0.25);

        // 해당 행의 숫자들
        const rowNums = midBlocks
          .filter(b => b.y >= rowY1 && b.y < rowY2)
          .sort((a,b) => a.x - b.x)
          .map(b => parseInt(b.text));

        // 누적점수 배열 (최대 10개)
        // 볼링 전광판은 누적점수를 표시하므로 오름차순으로 정렬된 숫자들
        const cumScores = rowNums
          .filter((n,idx,arr) => idx === 0 || n >= arr[idx-1]) // 오름차순 필터
          .slice(0, 10);

        // 총점 (해당 행의 오른쪽 큰 숫자)
        const rowTotal = scoreBlocks.find(b =>
          b.y >= rowY1 && b.y < rowY2
        );
        const totalScore = rowTotal
          ? parseInt(rowTotal.text)
          : cumScores[cumScores.length - 1] || null;

        // 프레임 배열 (10개, 없으면 null)
        const frames = Array.from({length: 10}, (_, f) => cumScores[f] ?? null);

        players.push({
          label: label.text,
          frames,
          totalScore,
          cumulative: cumScores,
        });
      });
    } else {
      // 라벨 없을 때 - 숫자만으로 파싱
      // Y좌표 클러스터링으로 행 구분
      const yValues = [...new Set(midBlocks.map(b => Math.round(b.y / 30) * 30))].sort((a,b)=>a-b);

      yValues.slice(0, 2).forEach((yCluster, i) => {
        const rowNums = midBlocks
          .filter(b => Math.abs(Math.round(b.y / 30) * 30 - yCluster) < 30)
          .sort((a,b) => a.x - b.x)
          .map(b => parseInt(b.text));

        const cumScores = rowNums.filter((n,idx,arr) =>
          idx === 0 || n >= arr[idx-1]
        ).slice(0, 10);

        const totalScore = scoreBlocks[i] ? parseInt(scoreBlocks[i].text) : cumScores[cumScores.length-1];

        players.push({
          label: `P${i+1}`,
          frames: Array.from({length:10}, (_,f) => cumScores[f] ?? null),
          totalScore,
          cumulative: cumScores,
        });
      });
    }

    // 결과가 없으면 fullText 기반으로 숫자 추출 시도
    if (players.length === 0 || players.every(p => !p.totalScore)) {
      const allNums = fullText.match(/\d+/g)?.map(Number)
        .filter(n => n >= 50 && n <= 300) || [];

      return res.status(200).json({
        success: true,
        players: [{
          label: "P1",
          frames: Array(10).fill(null),
          totalScore: allNums[allNums.length - 1] || null,
          cumulative: allNums,
        }],
        lane,
        fullText: fullText.slice(0, 1000),
        debug: { blocks: blocks.slice(0, 50), maxX, maxY },
      });
    }

    return res.status(200).json({
      success: true,
      players,
      lane,
      fullText: fullText.slice(0, 1000),
    });

  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}
