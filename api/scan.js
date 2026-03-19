export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { imageBase64, mimeType = "image/jpeg" } = req.body;
  if (!imageBase64) return res.status(400).json({ error: "No image provided" });

  const GEMINI_KEY = process.env.GEMINI_KEY;
  if (!GEMINI_KEY) return res.status(500).json({ error: "API key not configured" });

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [
              { inline_data: { mime_type: mimeType, data: imageBase64 } },
              { text: `이 볼링공 이미지를 분석해서 JSON으로만 답해줘. 다른 텍스트 없이 JSON만 출력해.\n{\n  "brand": "브랜드명 (Storm/Hammer/Motiv/Brunswick/Roto Grip/900 Global/DV8/Columbia 300/Ebonite/Radical/Track/SWAG 중 하나, 모르면 null)",\n  "name": "제품명 (볼에 쓰인 텍스트 그대로, 모르면 null)",\n  "colors": ["주요 색상들"],\n  "confidence": "high/medium/low"\n}` }
            ]
          }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 256 }
        })
      }
    );
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return res.status(200).json({ error: "parse_failed", raw: text });
    const result = JSON.parse(jsonMatch[0]);
    return res.status(200).json({ success: true, ...result });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
