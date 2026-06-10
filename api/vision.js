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

  // ── 브랜드 키워드 (브랜드명 + 각 브랜드 고유 마킹 텍스트) ─
  const BRAND_KEYWORDS = {
    "Storm":       ["storm", "not urethan", "iq tour", "mix", "phaze", "hyroad", "hy-road",
                    "marvel", "physix", "summit", "bionic", "typhoon", "monsoon", "rocket",
                    "ion max", "ion pro", "alpha crux", "code red", "code honor"],
    "Hammer":      ["hammer", "black widow", "hammerhead", "zero mercy", "full effect",
                    "purple pearl", "vibe", "nu hammer", "spawn", "78d"],
    "Motiv":       ["motiv", "venom", "jackal", "forge", "trident", "tank", "primal",
                    "apex", "raptor", "covert", "nuclear", "evoke", "supra"],
    "Brunswick":   ["brunswick", "karma", "twist", "rhino", "crown", "combat",
                    "energize", "ethos", "vapor", "hypnotize", "melee", "strategy",
                    "infinity quest", "kingpin"],
    "Roto Grip":   ["roto grip", "rotogrip", "hustle", "attention", "idol", "gem",
                    "transformer", "gremlin", "hype", "rockstar", "magic gem", "rst"],
    "900 Global":  ["900 global", "900global", "zen", "dark matter", "honey badger",
                    "ember", "cove", "vengeance", "viking", "wolverine", "origin"],
    "DV8":         ["dv8", "heckler", "pitbull", "thug", "intimidator", "mantra",
                    "hater", "dark side"],
    "Columbia 300":["columbia", "cobra", "beast", "eruption", "freeze", "piranha",
                    "atlas", "street rally", "ricochet"],
    "Ebonite":     ["ebonite", "game breaker", "cyclone", "choice", "spartan",
                    "emerge", "envision", "turbo"],
    "Radical":     ["radical", "guru", "outer limits", "zig zag", "ridiculous",
                    "deep impact", "evil eye", "intel recon"],
    "Track":       ["track", "kinetic", "theorem", "synthesis", "stealth", "rhyno",
                    "paragon", "i-core"],
    "SWAG":        ["swag", "assassin", "serpent", "judgement", "craze", "unreal",
                    "fusion", "apex solid"],
  };

  // ── 1단계: Cloud Vision OCR + 색상 ──────────────────────
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
              { type: "IMAGE_PROPERTIES", maxResults: 10 },
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

      // 브랜드 감지 — 브랜드명 + 제품명/마킹으로 감지
      for (const [brand, keywords] of Object.entries(BRAND_KEYWORDS)) {
        if (keywords.some(k => textLower.includes(k))) { visionBrand = brand; break; }
      }

      // 제품명 후보 추출 (불필요한 단어 제거)
      const NOISE = new Set(["usbc","abc","bowling","approved","oz","lbs","ball","not","urethan",
        "reactive","reactive resin","coverstock","performance","pro","shop","urethane",
        "h+o+","h+o","pearled","solid","hybrid"]);
      const brandLowers = visionBrand ? BRAND_KEYWORDS[visionBrand] : [];
      const productCandidates = textLines
        .filter(t => t.length > 2 && t.length < 50)
        .filter(t => !/^\d+(\.\d+)?$/.test(t))
        .filter(t => !/^[A-Z]{1,2}$/.test(t))
        .filter(t => !brandLowers.some(k => t.toLowerCase() === k))
        .filter(t => !NOISE.has(t.toLowerCase()));
      visionName = productCandidates.length > 0 ? productCandidates.slice(0, 2).join(" ").trim() : null;

      // 색상 추출 (더 넓은 범위로 개선)
      const rgbToColor = (r=0, g=0, b=0) => {
        const max = Math.max(r, g, b), min = Math.min(r, g, b), sat = max - min;
        if (max < 45) return "black";
        if (min > 210) return "white";
        if (sat < 25 && max > 160) return "silver";
        if (sat < 20 && max < 90) return "black";
        // 밝은 하늘색/시안 (이미지의 볼처럼)
        if (b > 150 && g > 130 && r < 130 && b > g) return "blue";
        if (g > 150 && b > 150 && r < 120) return "teal";
        if (r > 180 && g >= 60 && g <= 170 && b < 80) return "orange";
        if (r > 150 && g < 70 && b < 70) return "red";
        if (r > 150 && b > 100 && g < 100) return "pink";
        if (b > 120 && r < 110 && g < 120) return "blue";
        if (g > 110 && r < 100 && b < 100) return "green";
        if (r > 70 && b > 90 && g < 80) return "purple";
        if (r > 170 && g > 150 && b < 80) return "gold";
        return null;
      };
      const colorCounts = {};
      (result.imagePropertiesAnnotation?.dominantColors?.colors || []).slice(0, 10).forEach(c => {
        const name = rgbToColor(c.color?.red||0, c.color?.green||0, c.color?.blue||0);
        if (name) colorCounts[name] = (colorCounts[name]||0) + (c.pixelFraction||c.score||0.1);
      });
      colors = Object.entries(colorCounts).sort((a,b)=>b[1]-a[1]).slice(0,4).map(([c])=>c);
    }
  } catch(e) {}

  // ── 2단계: 후보 필터링 ───────────────────────────────────
  // 브랜드 확인 → 해당 브랜드만
  // 브랜드 미확인 → 색상으로 1차 필터링 후 최대 45개
  let finalCandidates = candidates;
  if (candidates.length > 0) {
    if (visionBrand) {
      finalCandidates = candidates.filter(c => c.brand === visionBrand);
      if (finalCandidates.length === 0) finalCandidates = candidates; // 혹시 없으면 전체
    } else {
      // 색상으로 필터링
      if (colors.length > 0) {
        const colorMatched = candidates.filter(c =>
          (c.colors||[]).some(bc => colors.includes(bc))
        );
        finalCandidates = colorMatched.length >= 5 ? colorMatched : candidates;
      }
      // 그래도 많으면 45개로 제한 (Gemini 컨텍스트 최적화)
      if (finalCandidates.length > 45) {
        finalCandidates = finalCandidates.slice(0, 45);
      }
    }
  }

  // ── 3단계: Gemini Vision — 후보 목록에서 직접 선택 ───────
  let geminiResult = null;
  if (GEMINI_KEY && finalCandidates.length > 0) {
    try {
      const ballList = finalCandidates
        .map((c, i) => `${i+1}. ${c.brand} | ${c.name}`)
        .join("\n");

      const geminiPrompt = `이 볼링공 이미지를 분석해서 아래 목록 중 가장 일치하는 볼을 찾아줘.

볼의 색상, 브랜드 로고, 인쇄된 텍스트, 표면 무늬(마블/솔리드/펄 등), 전체 디자인을 종합적으로 판단해줘.
OCR 텍스트 힌트: "${fullText.slice(0,300).replace(/\n/g," ")}"
감지된 주요 색상: ${colors.join(", ") || "불명"}

=== 후보 목록 ===
${ballList}

아래 JSON 형식으로만 답해. 다른 말 없이 JSON만:
{"matches":[{"rank":1,"brand":"Storm","name":"Typhoon","reason":"bright blue solid coverstock with Storm logo"},{"rank":2,"brand":"Storm","name":"Bionic","reason":"similar blue color"}]}

- 최대 3개, 확신도 높은 순
- 반드시 위 목록에 있는 볼만 선택
- 확신이 없으면 솔직하게 가장 가능성 높은 1개만`;

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
      const start = rawText.indexOf("{"), end = rawText.lastIndexOf("}");
      if (start !== -1 && end !== -1) {
        const parsed = JSON.parse(rawText.slice(start, end+1));
        geminiResult = parsed.matches || null;
      }
    } catch(e) {}
  }

  return res.status(200).json({
    success: true,
    geminiMatches: geminiResult,
    brand: visionBrand,
    name: visionName,
    colors,
    fullText: fullText.slice(0, 300),
    candidateCount: finalCandidates.length,
    confidence: (geminiResult?.length > 0) ? "high"
      : (visionBrand && visionName) ? "medium"
      : (visionBrand || visionName) ? "low" : "low",
  });
}
