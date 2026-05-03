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
              { type: "TEXT_DETECTION", maxResults: 20 },
              { type: "LABEL_DETECTION", maxResults: 10 },
              { type: "IMAGE_PROPERTIES", maxResults: 8 },
            ]
          }]
        })
      }
    );

    const data = await response.json();
    if (!response.ok) {
      return res.status(200).json({ error: data.error?.message || "Vision API error" });
    }

    const result = data.responses?.[0];
    if (!result) return res.status(200).json({ error: "No result" });

    // 텍스트 추출
    const fullText = result.textAnnotations?.[0]?.description || "";
    const textLines = fullText.split("\n").map(t => t.trim()).filter(t => t.length > 1);

    // 브랜드 감지
    const brandKeywords = {
      "Storm": ["storm"], "Hammer": ["hammer"], "Motiv": ["motiv"],
      "Brunswick": ["brunswick"], "Roto Grip": ["roto grip","roto","grip"],
      "900 Global": ["900 global","900global"], "DV8": ["dv8"],
      "Columbia 300": ["columbia"], "Ebonite": ["ebonite"],
      "Radical": ["radical"], "Track": ["track"], "SWAG": ["swag"],
    };

    const textLower = fullText.toLowerCase();
    let detectedBrand = null;
    for (const [brand, keywords] of Object.entries(brandKeywords)) {
      if (keywords.some(k => textLower.includes(k))) {
        detectedBrand = brand;
        break;
      }
    }

    // 제품명 추출
    const brandLowers = detectedBrand ? brandKeywords[detectedBrand] : [];
    const productCandidates = textLines
      .filter(t => t.length > 2 && t.length < 50)
      .filter(t => !/^\d+(\.\d+)?$/.test(t))
      .filter(t => !/^[A-Z]{1,2}$/.test(t))
      .filter(t => !brandLowers.some(k => t.toLowerCase() === k))
      .filter(t => !["usbc","abc","bowling","approved","oz","lbs"].includes(t.toLowerCase()));

    const productName = productCandidates.length > 0
      ? productCandidates.slice(0, 2).join(" ").trim()
      : null;

    // ── RGB → 색상명 변환 (개선된 임계값) ──────────────────
    const rgbToColor = (r=0, g=0, b=0) => {
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);

      // 무채색 계열 먼저 처리
      if (max < 50) return "black";
      if (min > 200) return "white";
      if (max - min < 30 && max > 150) return "silver";
      if (max - min < 25 && max < 100) return "black";

      // 채도 있는 색상
      // orange: R 높음, G 중간(60~170), B 낮음
      if (r > 180 && g >= 60 && g <= 170 && b < 80) return "orange";
      // red: R 높음, G 낮음, B 낮음 (더 엄격)
      if (r > 160 && g < 60 && b < 80) return "red";
      // pink/magenta: R 높음, B 중간~높음, G 낮음
      if (r > 160 && b > 100 && g < 100) return "pink";
      // blue: B 높음, R 낮음
      if (b > 130 && r < 100 && g < 130) return "blue";
      // teal/cyan: G+B 높음, R 낮음
      if (g > 130 && b > 130 && r < 100) return "teal";
      // green: G 높음, R/B 낮음
      if (g > 120 && r < 100 && b < 100) return "green";
      // purple/violet: R+B 높음, G 낮음
      if (r > 80 && b > 100 && g < 80) return "purple";
      // gold/yellow: R+G 높음, B 낮음
      if (r > 180 && g > 160 && b < 80) return "gold";
      // navy: B 중간, R/G 낮음
      if (b > 80 && b < 140 && r < 60 && g < 80) return "blue";

      return null;
    };

    const colorCounts = {};
    (result.imagePropertiesAnnotation?.dominantColors?.colors || [])
      .slice(0, 8)
      .forEach(c => {
        const colorName = rgbToColor(c.color?.red, c.color?.green, c.color?.blue);
        if (colorName) {
          // pixelFraction(면적 비율) 가중치 적용
          const weight = c.pixelFraction || c.score || 0.1;
          colorCounts[colorName] = (colorCounts[colorName] || 0) + weight;
        }
      });

    // 면적 비율 기준으로 정렬, 상위 3개
    const colors = Object.entries(colorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([color]) => color);

    return res.status(200).json({
      success: true,
      brand: detectedBrand,
      name: productName,
      colors,
      fullText: fullText.slice(0, 300),
      confidence: detectedBrand && productName ? "high"
        : detectedBrand || productName ? "medium" : "low"
    });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
