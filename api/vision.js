export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { imageBase64, mimeType = "image/jpeg" } = req.body;
  if (!imageBase64) return res.status(400).json({ error: "No image provided" });

  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  const GEMINI_KEY = process.env.GEMINI_KEY;
  if (!GOOGLE_API_KEY) return res.status(500).json({ error: "API key not configured" });

  // ── Cloud Vision + Gemini Vision 병렬 호출 ─────────────
  const [visionRes, geminiRes] = await Promise.allSettled([
    // (1) Cloud Vision: 텍스트 OCR + 색상 분석
    fetch(
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
    ).then(r => r.json()),

    // (2) Gemini Vision: 구 형태·색상·브랜드 로고 종합 인식
    GEMINI_KEY ? fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [
              { inline_data: { mime_type: mimeType, data: imageBase64 } },
              { text: `이 이미지에서 볼링공을 분석해줘.
볼링공의 브랜드(Storm, Hammer, Motiv, Brunswick, Roto Grip, 900 Global, DV8, Columbia 300, Ebonite, Radical, Track, SWAG 중 하나),
제품명, 주요 색상(2~3개), 커버스톡 패턴(solid/pearl/hybrid/urethane 중)을 파악해줘.
텍스트가 보이면 그대로 읽고, 로고/색상/형태로도 추론해줘.

반드시 아래 JSON 형식으로만 답해. 다른 말 없이 JSON만:
{"brand":"Storm","name":"Phaze II","colors":["blue","silver"],"pattern":"pearl","confidence":"high"}

확인 불가 필드는 null. confidence는 high/medium/low.` }
            ]
          }],
          generationConfig: { temperature: 0, maxOutputTokens: 256, thinkingConfig: { thinkingBudget: 0 } }
        })
      }
    ).then(r => r.json()) : Promise.resolve(null),
  ]);

  try {
    // ── Cloud Vision 결과 파싱 ───────────────────────────
    let visionBrand = null, visionName = null, colors = [], fullText = "";
    if (visionRes.status === "fulfilled" && visionRes.value?.responses?.[0]) {
      const result = visionRes.value.responses[0];
      fullText = result.textAnnotations?.[0]?.description || "";
      const textLines = fullText.split("\n").map(t => t.trim()).filter(t => t.length > 1);

      const brandKeywords = {
        "Storm": ["storm"], "Hammer": ["hammer"], "Motiv": ["motiv"],
        "Brunswick": ["brunswick"], "Roto Grip": ["roto grip","roto","grip"],
        "900 Global": ["900 global","900global","900"], "DV8": ["dv8"],
        "Columbia 300": ["columbia"], "Ebonite": ["ebonite"],
        "Radical": ["radical"], "Track": ["track"], "SWAG": ["swag"],
      };

      const textLower = fullText.toLowerCase();
      for (const [brand, keywords] of Object.entries(brandKeywords)) {
        if (keywords.some(k => textLower.includes(k))) {
          visionBrand = brand;
          break;
        }
      }

      const brandLowers = visionBrand ? brandKeywords[visionBrand] : [];
      const productCandidates = textLines
        .filter(t => t.length > 2 && t.length < 50)
        .filter(t => !/^\d+(\.\d+)?$/.test(t))
        .filter(t => !/^[A-Z]{1,2}$/.test(t))
        .filter(t => !brandLowers.some(k => t.toLowerCase() === k))
        .filter(t => !["usbc","abc","bowling","approved","oz","lbs"].includes(t.toLowerCase()));

      visionName = productCandidates.length > 0
        ? productCandidates.slice(0, 2).join(" ").trim()
        : null;

      // 색상 추출
      const rgbToColor = (r=0, g=0, b=0) => {
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        if (max < 50) return "black";
        if (min > 200) return "white";
        if (max - min < 30 && max > 150) return "silver";
        if (max - min < 25 && max < 100) return "black";
        if (r > 180 && g >= 60 && g <= 170 && b < 80) return "orange";
        if (r > 160 && g < 60 && b < 80) return "red";
        if (r > 160 && b > 100 && g < 100) return "pink";
        if (b > 130 && r < 100 && g < 130) return "blue";
        if (g > 130 && b > 130 && r < 100) return "teal";
        if (g > 120 && r < 100 && b < 100) return "green";
        if (r > 80 && b > 100 && g < 80) return "purple";
        if (r > 180 && g > 160 && b < 80) return "gold";
        if (b > 80 && b < 140 && r < 60 && g < 80) return "blue";
        return null;
      };

      const colorCounts = {};
      (result.imagePropertiesAnnotation?.dominantColors?.colors || [])
        .slice(0, 8)
        .forEach(c => {
          const colorName = rgbToColor(c.color?.red, c.color?.green, c.color?.blue);
          if (colorName) {
            const weight = c.pixelFraction || c.score || 0.1;
            colorCounts[colorName] = (colorCounts[colorName] || 0) + weight;
          }
        });

      colors = Object.entries(colorCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([color]) => color);
    }

    // ── Gemini Vision 결과 파싱 ──────────────────────────
    let geminiBrand = null, geminiName = null, geminiColors = [], geminiPattern = null, geminiConfidence = "low";
    if (geminiRes.status === "fulfilled" && geminiRes.value) {
      try {
        const parts = geminiRes.value.candidates?.[0]?.content?.parts || [];
        const rawText = parts.filter(p => p.text).map(p => p.text).join("");
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const g = JSON.parse(jsonMatch[0]);
          geminiBrand = g.brand || null;
          geminiName = g.name || null;
          geminiColors = g.colors || [];
          geminiPattern = g.pattern || null;
          geminiConfidence = g.confidence || "low";
        }
      } catch(e) {}
    }

    // ── 결과 병합: Gemini 우선, Cloud Vision 보완 ────────
    // 브랜드: Gemini high/medium이면 우선, 아니면 Cloud Vision
    const finalBrand = (geminiConfidence !== "low" && geminiBrand) ? geminiBrand : (visionBrand || geminiBrand);
    // 제품명: Gemini가 읽은 이름 + Cloud Vision OCR 보완
    const finalName = geminiName || visionName;
    // 색상: Gemini 색상 + Cloud Vision 색상 합산 (중복 제거)
    const finalColors = [...new Set([...geminiColors, ...colors])].slice(0, 4);
    // 패턴
    const finalPattern = geminiPattern || null;

    const confidence = (finalBrand && finalName) ? "high"
      : (finalBrand || finalName) ? "medium" : "low";

    return res.status(200).json({
      success: true,
      brand: finalBrand,
      name: finalName,
      colors: finalColors,
      pattern: finalPattern,
      fullText: fullText.slice(0, 300),
      confidence,
      // 디버그용
      _vision: visionBrand ? { brand: visionBrand, name: visionName } : null,
      _gemini: geminiBrand ? { brand: geminiBrand, name: geminiName, confidence: geminiConfidence } : null,
    });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
