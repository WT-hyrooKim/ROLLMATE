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

  const prompt = `이 볼링 전광판 이미지를 분석해줘. 반드시 순수 JSON만 반환해. 마크다운 없이.

형식:
{"lane":"05","players":[{"label":"53A","frames":[{"shots":["9","/"],"cumScore":18},{"shots":["8","/"],"cumScore":38},{"shots":["X"],"cumScore":68},{"shots":["X"],"cumScore":98},{"shots":["X"],"cumScore":126},{"shots":["8","1"],"cumScore":145},{"shots":["X"],"cumScore":154},{"shots":["X"],"cumScore":183},{"shots":["9","/"],"cumScore":203},{"shots":["X","",""],"cumScore":223}],"totalScore":223}]}

규칙:
- 나비넥타이 기호 = "X" (스트라이크)
- / = 스페어
- - = 거터
- 빈프레임 = {"shots":[],"cumScore":null}
- 10프레임은 shots 3개까지`;

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
            maxOutputTokens: 2048,
            responseMimeType: "application/json"
          }
        })
      }
    );

    const data = await response.json();
    if (!response.ok) return res.status(200).json({ error: data.error?.message || "Gemini API 오류" });

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    let parsed;
    try {
      const clean = text.replace(/```json\n?/g,"").replace(/```\n?/g,"").trim();
      parsed = JSON.parse(clean);
    } catch(e) {
      // 디버그: raw 텍스트 전체 반환
      return res.status(200).json({
        error: "JSON 파싱 실패",
        rawText: text,
        parseError: e.message
      });
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
