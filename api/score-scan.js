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

  const prompt = `이 볼링 전광판 이미지를 분석해서 각 플레이어의 점수를 JSON으로 반환해줘.

볼링 점수판 규칙:
- 나비넥타이/활모양 기호 = 스트라이크 = "X"
- / 기호 = 스페어 = "/"
- - 기호 = 거터/미스 = "-"
- 숫자 = 해당 핀수
- 프레임 아래 누적점수가 표시됨

반드시 JSON만 반환하고 마크다운 코드블록 없이:
{"lane":"레인번호","players":[{"label":"53A","frames":[{"shots":["9","/"],"cumScore":18},{"shots":["X"],"cumScore":38}],"totalScore":223}]}

빈 프레임은 {"shots":[],"cumScore":null}`;

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
          generationConfig: { temperature: 0.1, maxOutputTokens: 2048 }
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
      return res.status(200).json({ error: "JSON 파싱 실패", rawText: text.slice(0,500) });
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
