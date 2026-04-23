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

  const prompt = `당신은 볼링공 전문가입니다. 이 볼링공 이미지를 분석해주세요.

분석 규칙:
1. 제품명: 볼 표면에서 가장 크고 선명하게 쓰인 텍스트만 (작은 글씨/무게숫자/주소/승인번호 무시)
2. 브랜드: 로고나 작게 쓰인 브랜드명 (Storm/Hammer/Motiv/Brunswick/Roto Grip/900 Global/DV8/Columbia 300/Ebonite/Radical/Track/SWAG)
3. 색상: 볼의 주요 배경색과 패턴색 모두
4. 패턴: 표면 디자인 특징

반드시 JSON만 출력 (설명 없이):
{
  "brand": "브랜드명 또는 null",
  "name": "제품명 텍스트만 (예: Phaze II, Black Widow, Idol), 모르면 null",
  "colors": ["주요색상 영어 (purple/black/silver/pearl/red/blue/green/orange/gold/white/gray/pink/teal)"],
  "pattern": "marble/swirl/solid/pearl/hybrid/reactive 중 하나",
  "colorDescription": "색상 디자인 한 문장 설명",
  "confidence": "high/medium/low"
}`;

  // 2025~2026 사용 가능한 모델 순서대로 시도
  const models = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
  ];

  let lastError = null;

  for (const model of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GOOGLE_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [
              { inline_data: { mime_type: mimeType, data: imageBase64 } },
              { text: prompt }
            ]}],
            generationConfig: { temperature: 0.1, maxOutputTokens: 400 }
          })
        }
      );

      const data = await response.json();

      if (response.status === 429) {
        lastError = `${model}: quota exceeded`;
        continue;
      }
      if (response.status === 404) {
        lastError = `${model}: model not found`;
        continue;
      }
      if (!response.ok) {
        lastError = `${model}: ${data.error?.message || "unknown error"}`;
        continue;
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if (!text) {
        lastError = `${model}: empty response (finishReason: ${data.candidates?.[0]?.finishReason})`;
        continue;
      }

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        lastError = `${model}: parse failed - ${text.slice(0,100)}`;
        continue;
      }

      const result = JSON.parse(jsonMatch[0]);
      return res.status(200).json({ success: true, model, ...result });

    } catch (e) {
      lastError = `${model}: ${e.message}`;
      continue;
    }
  }

  return res.status(500).json({
    error: "all_models_failed",
    message: lastError
  });
}
