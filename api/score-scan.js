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

  const imagePart = { inline_data: { mime_type: mimeType, data: imageBase64 } };
  const contents = [{ parts: [imagePart, { text: prompt }] }];

  // text 추출: thinking 모델은 parts가 여러 개일 수 있으므로 text 타입 파트를 모두 합침
  function extractText(data) {
    const parts = data.candidates?.[0]?.content?.parts || [];
    return parts
      .filter(p => p.text !== undefined)
      .map(p => p.text)
      .join("");
  }

  function parseJSON(text) {
    // 방법1: 그대로
    try { return JSON.parse(text.trim()); } catch {}
    // 방법2: 마크다운 코드블록 제거
    try {
      const clean = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      return JSON.parse(clean);
    } catch {}
    // 방법3: 첫 { 부터 마지막 } 까지
    try {
      const start = text.indexOf("{");
      const end = text.lastIndexOf("}");
      if (start !== -1 && end !== -1) return JSON.parse(text.slice(start, end + 1));
    } catch {}
    return null;
  }

  function buildResult(parsed) {
    const players = (parsed.players || []).map(p => {
      const frames = (p.frames || []).map(f => ({
        shots: f.shots || [],
        cumScore: f.cumScore ?? null,
        isStrike: f.shots?.[0] === "X",
        isSpare: f.shots?.includes("/"),
      }));
      while (frames.length < 10) frames.push({ shots: [], cumScore: null, isStrike: false, isSpare: false });
      return {
        label: p.label,
        frameShots: frames.map(f => f.shots.length > 0 ? { shots: f.shots, isStrike: f.isStrike, isSpare: f.isSpare } : null),
        frameCumulative: frames.map(f => f.cumScore),
        totalScore: p.totalScore ?? null,
      };
    });
    return { success: true, players, lane: parsed.lane || null };
  }

  async function callGemini(model, useThinkingOff) {
    const body = {
      contents,
      generationConfig: { temperature: 0.1, maxOutputTokens: 2048 },
    };
    if (useThinkingOff) {
      body.generationConfig.thinkingConfig = { thinkingBudget: 0 };
    }
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || `${model} API 오류`);
    return data;
  }

  try {
    // 시도 1: gemini-2.5-flash, thinkingBudget:0
    let text = "";
    let modelUsed = "";
    try {
      const data = await callGemini("gemini-2.5-flash", true);
      text = extractText(data);
      modelUsed = "gemini-2.5-flash (thinking off)";
    } catch (e1) {
      // 시도 2: gemini-2.0-flash-001 (non-thinking)
      const data = await callGemini("gemini-2.0-flash-001", false);
      text = extractText(data);
      modelUsed = "gemini-2.0-flash-001";
    }

    const parsed = parseJSON(text);
    if (!parsed) {
      return res.status(200).json({ error: "JSON 파싱 실패", rawText: text, modelUsed });
    }

    return res.status(200).json({ ...buildResult(parsed), modelUsed });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
