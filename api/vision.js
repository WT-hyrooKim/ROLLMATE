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
    // Cloud Vision API - TEXT_DETECTION + LABEL_DETECTION
    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requests: [{
            image: { content: imageBase64 },
            features: [
              { type: "TEXT_DETECTION", maxResults: 10 },
              { type: "LABEL_DETECTION", maxResults: 10 },
              { type: "IMAGE_PROPERTIES", maxResults: 5 },
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
    const textBlocks = (result.textAnnotations || []).slice(1).map(t => t.description);

    // 라벨 추출
    const labels = (result.labelAnnotations || []).map(l => l.description.toLowerCase());

    // 주요 색상 추출
    const colors = (result.imagePropertiesAnnotation?.dominantColors?.colors || [])
      .slice(0, 3)
      .map(c => {
        const { red=0, green=0, blue=0 } = c.color;
        // RGB → 색상명 변환
        if (red > 150 && green < 100 && blue < 100) return "red";
        if (red < 100 && green < 100 && blue > 150) return "blue";
        if (red < 80 && green < 80 && blue < 80) return "black";
        if (red > 200 && green > 200 && blue > 200) return "white";
        if (red > 150 && green < 100 && blue > 150) return "purple";
        if (red > 150 && green > 100 && blue < 80) return "orange";
        if (red < 100 && green > 130 && blue < 100) return "green";
        if (red > 180 && green > 180 && blue < 100) return "gold";
        if (red > 150 && green > 150 && blue > 150) return "silver";
        return null;
      })
      .filter(Boolean);

    // 볼링공 브랜드 감지
    const brandKeywords = {
      "Storm": ["storm"], "Hammer": ["hammer"], "Motiv": ["motiv"],
      "Brunswick": ["brunswick"], "Roto Grip": ["roto","grip"],
      "900 Global": ["900","global"], "DV8": ["dv8"],
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

    // 제품명 추출 (가장 큰 텍스트 블록 - 브랜드명 제외)
    const brandLower = detectedBrand?.toLowerCase() || "";
    const productName = textBlocks
      .filter(t => t.length > 2 && t.length < 40)
      .filter(t => !brandKeywords[detectedBrand]?.some(k => t.toLowerCase().includes(k)))
      .filter(t => !/^\d+$/.test(t)) // 숫자만인 것 제외
      .filter(t => !/^[a-z]{1,2}$/i.test(t)) // 1-2글자 제외
      .slice(0, 3)
      .join(" ") || null;

    return res.status(200).json({
      success: true,
      brand: detectedBrand,
      name: productName,
      colors: [...new Set(colors)],
      fullText: fullText.slice(0, 200),
      labels: labels.slice(0, 5),
      confidence: detectedBrand && productName ? "high" : detectedBrand || productName ? "medium" : "low"
    });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
