export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { imageBase64, mimeType = "image/jpeg" } = req.body;
  if (!imageBase64) return res.status(400).json({ error: "No image provided" });

  const GEMINI_KEY = process.env.GEMINI_KEY;
  if (!GEMINI_KEY) return res.status(500).json({ error: "Gemini API key not configured" });

  const prompt = `볼링 전광판 이미지에서 점수를 읽어줘.

나비넥타이/활 모양 기호는 스트라이크("X")야.
/ 는 스페어, - 는 거터, 숫자는 핀수야.

아래 JSON 형식으로만 답해줘. 다른 말 하지 말고 JSON만:

{"lane":"레인번호","players":[{"label":"53A","frames":[{"shots":["9","/"],"cumScore":18},{"shots":["X"],"cumScore":38}],"totalScore":223}]}

빈 프레임: {"shots":[],"cumScore":null}
10프레임은 shots 최대 3개.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [
              { inline_data: { mime_type: mimeType, data: imageBase64 } },
              { text: prompt }
            ]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 2048
          }
        })
      }
    );

    const data = await response.json();
    if (!response.ok) return res.status(200).json({ error: data.error?.message || "Gemini API 오류" });

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // JSON 추출 - 여러 방법 시도
    let parsed;
    try {
      // 방법1: 그대로 파싱
      parsed = JSON.parse(text.trim());
    } catch(e1) {
      try {
        // 방법2: ```json 제거
        const clean = text.replace(/```json\n?/g,"").replace(/```\n?/g,"").trim();
        parsed = JSON.parse(clean);
      } catch(e2) {
        try {
          // 방법3: { } 사이만 추출
          const match = text.match(/\{[\s\S]*\}/);
          if (match) parsed = JSON.parse(match[0]);
          else throw new Error("JSON not found");
        } catch(e3) {
          return res.status(200).json({
            error: "JSON 파싱 실패",
            rawText: text
          });
        }
      }
    }

    const players = (parsed.players||[]).map(p => {
      const frames = (p.frames||[]).map(f => ({
        shots: f.shots||[],
        cumScore: f.cumScore??null,
        isStrike: f.shots?.[0]==="X",
        isSpare: f.shots?.includes("/"),
      }));
      while(frames.length<10) frames.push({shots:[],cumScore:null,isStrike:false,isSpare:false});
      return {
        label: p.label,
        frameShots: frames.map(f=>f.shots.length>0?{shots:f.shots,isStrike:f.isStrike,isSpare:f.isSpare}:null),
        frameCumulative: frames.map(f=>f.cumScore),
        totalScore: p.totalScore??null,
      };
    });

    return res.status(200).json({ success:true, players, lane:parsed.lane||null });

  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}
