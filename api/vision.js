export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { imageBase64, mimeType = "image/jpeg", candidates = [] } = req.body;
  if (!imageBase64) return res.status(400).json({ error: "No image provided" });

  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  const GEMINI_KEY = process.env.GEMINI_KEY;
  if (!GOOGLE_API_KEY) return res.status(500).json({ error: "API key not configured" });

  // ── 1단계: Cloud Vision — 텍스트 OCR + 색상 분석 ────────
  let visionBrand = null, visionName = null, colors = [], fullText = "";
  try {
    const vRes = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requests: [{
            image: { content: imageBase64 },
            features: [
              { type: "TEXT_DETECTION", maxResults: 20 },
              { type: "IMAGE_PROPERTIES", maxResults: 8 },
            ]
          }]
        })
      }
    );
    const vData = await vRes.json();
    const result = vData.responses?.[0];

    if (result) {
      fullText = result.textAnnotations?.[0]?.description || "";
      const textLines = fullText.split("\n").map(t => t.trim()).filter(t => t.length > 1);
      const textLower = fullText.toLowerCase();

      // 브랜드 감지
      const brandKeywords = {
        "Storm": ["storm"], "Hammer": ["hammer"], "Motiv": ["motiv"],
        "Brunswick": ["brunswick"], "Roto Grip": ["roto grip","rotogrip"],
        "900 Global": ["900 global","900global"], "DV8": ["dv8"],
        "Columbia 300": ["columbia 300","columbia"], "Ebonite": ["ebonite"],
        "Radical": ["radical"], "Track": ["track"], "SWAG": ["swag"],
      };
      for (const [brand, keywords] of Object.entries(brandKeywords)) {
        if (keywords.some(k => textLower.includes(k))) { visionBrand = brand; break; }
      }

      // 제품명 후보 추출
      const brandLowers = visionBrand ? brandKeywords[visionBrand] : [];
      const productCandidates = textLines
        .filter(t => t.length > 2 && t.length < 50)
        .filter(t => !/^\d+(\.\d+)?$/.test(t))
        .filter(t => !/^[A-Z]{1,2}$/.test(t))
        .filter(t => !brandLowers.some(k => t.toLowerCase() === k))
        .filter(t => !["usbc","abc","bowling","approved","oz","lbs","ball"].includes(t.toLowerCase()));
      visionName = productCandidates.length > 0 ? productCandidates.slice(0, 3).join(" ").trim() : null;

      // 색상 추출
      const rgbToColor = (r=0, g=0, b=0) => {
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
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
      (result.imagePropertiesAnnotation?.dominantColors?.colors || []).slice(0, 8).forEach(c => {
        const name = rgbToColor(c.color?.red, c.color?.green, c.color?.blue);
        if (name) colorCounts[name] = (colorCounts[name] || 0) + (c.pixelFraction || c.score || 0.1);
      });
      colors = Object.entries(colorCounts).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([c])=>c);
    }
  } catch(e) {}

  // ── 2단계: Gemini — 후보 목록에서 직접 선택 ────────────
  // 클라이언트에서 후보 볼 목록을 받아 Gemini가 목록 중 가장 일치하는 것을 선택
  let geminiResult = null;
  if (GEMINI_KEY && candidates.length > 0) {
    try {
      // 브랜드 확인된 경우 해당 브랜드 후보만, 없으면 전체 후보 사용
      const filteredCandidates = visionBrand
        ? candidates.filter(c => c.brand === visionBrand)
        : candidates;

      // 후보가 없으면 전체 사용 (브랜드 감지 실패 대비)
      const finalCandidates = filteredCandidates.length > 0 ? filteredCandidates : candidates;

      // 목록을 "브랜드 | 제품명" 형태로 직렬화
      const ballList = finalCandidates
        .map((c, i) => `${i+1}. ${c.brand} | ${c.name}`)
        .join("\n");

      const geminiPrompt = `이 볼링공 이미지를 분석해서 아래 목록 중 가장 일치하는 볼을 찾아줘.

볼의 색상, 브랜드 로고, 텍스트, 무늬, 전체적인 디자인을 종합적으로 보고 판단해줘.
OCR로 읽힌 텍스트 힌트: "${fullText.slice(0,200).replace(/\n/g," ")}"

=== 후보 목록 ===
${ballList}

반드시 아래 JSON 형식으로만 답해. 다른 말 없이 JSON만:
{"matches":[{"rank":1,"brand":"Storm","name":"Phaze II","reason":"blue swirl pattern matches"},{"rank":2,"brand":"Storm","name":"Phaze III","reason":"similar color scheme"}]}

최대 3개까지, 확신도 높은 순서로. 후보 목록에 없는 볼은 절대 선택하지 마.`;

      const gRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent?key=${GEMINI_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [
              { inline_data: { mime_type: mimeType, data: imageBase64 } },
              { text: geminiPrompt }
            ]}],
            generationConfig: { temperature: 0, maxOutputTokens: 512 }
          })
        }
      );
      const gData = await gRes.json();
      const parts = gData.candidates?.[0]?.content?.parts || [];
      const rawText = parts.filter(p=>p.text).map(p=>p.text).join("");
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        geminiResult = parsed.matches || null;
      }
    } catch(e) {}
  }

  return res.status(200).json({
    success: true,
    // Gemini 직접 매칭 결과 (있으면)
    geminiMatches: geminiResult,
    // Cloud Vision 기본 결과 (fallback용)
    brand: visionBrand,
    name: visionName,
    colors,
    fullText: fullText.slice(0, 300),
    confidence: (geminiResult?.length > 0) ? "high"
      : (visionBrand && visionName) ? "medium"
      : (visionBrand || visionName) ? "low" : "low",
  });
}
