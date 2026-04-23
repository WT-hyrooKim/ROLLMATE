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

    // 제품명 추출 - 숫자/짧은글자/브랜드명 제외하고 가장 긴 텍스트
    const brandLowers = detectedBrand
      ? brandKeywords[detectedBrand]
      : [];

    const productCandidates = textLines
      .filter(t => t.length > 2 && t.length < 50)
      .filter(t => !/^\d+(\.\d+)?$/.test(t))           // 숫자만 제외
      .filter(t => !/^[A-Z]{1,2}$/.test(t))             // 1-2글자 대문자 제외
      .filter(t => !brandLowers.some(k => t.toLowerCase() === k)) // 브랜드명 제외
      .filter(t => !["usbc","abc","bowling","approved","oz","lbs"].includes(t.toLowerCase()));

    const productName = productCandidates.length > 0
      ? productCandidates.slice(0, 2).join(" ").trim()
      : null;

    // 색상 추출
    const colorMap = (r=0,g=0,b=0) => {
      if (r > 150 && g < 100 && b < 100) return "red";
      if (r < 100 && g < 100 && b > 150) return "blue";
      if (r < 60 && g < 60 && b < 60) return "black";
      if (r > 200 && g > 200 && b > 200) return "white";
      if (r > 130 && g < 80 && b > 130) return "purple";
      if (r > 150 && g > 100 && b < 80) return "orange";
      if (r < 80 && g > 120 && b < 80) return "green";
      if (r > 180 && g > 160 && b < 80) return "gold";
      if (r > 150 && g > 150 && b > 150) return "silver";
      if (r > 150 && g < 80 && b > 80) return "pink";
      if (r < 80 && g > 130 && b > 130) return "teal";
      return null;
    };

    const colors = (result.imagePropertiesAnnotation?.dominantColors?.colors || [])
      .slice(0, 5)
      .map(c => colorMap(c.color?.red, c.color?.green, c.color?.blue))
      .filter(Boolean)
      .filter((v, i, a) => a.indexOf(v) === i); // 중복 제거

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
