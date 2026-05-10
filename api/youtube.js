export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  if (!GOOGLE_API_KEY) return res.status(500).json({ error: "API key not configured" });

  const SUPABASE_URL = "https://klesgczkebudkuidhflc.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsZXNnY3prZWJ1ZGt1aWRoZmxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzOTE1MjksImV4cCI6MjA4ODk2NzUyOX0.ZKAAmR2yj9Aia-1-q_3ZAOfx-95MnW9OWz9jpr2qxfw";

  // ── POST: @핸들로 채널 ID 조회 ──────────────────────────
  if (req.method === "POST") {
    const { handle } = req.body;
    if (!handle) return res.status(400).json({ error: "handle required" });

    // @제거 후 핸들 정리
    const cleanHandle = handle.replace(/^@/, "").replace(/^https?:\/\/.*@/, "").trim();

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?` +
        `part=id,snippet&forHandle=${cleanHandle}&key=${GOOGLE_API_KEY}`
      );
      const data = await response.json();

      if (!data.items?.length) {
        return res.status(200).json({ error: "채널을 찾을 수 없어요. @핸들을 확인해주세요." });
      }

      const ch = data.items[0];
      return res.status(200).json({
        success: true,
        channelId: ch.id,
        channelName: ch.snippet.title,
        channelUrl: `https://www.youtube.com/@${cleanHandle}`,
        thumbnail: ch.snippet.thumbnails?.default?.url,
      });

    } catch(e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // ── GET: 영상 목록 조회 ──────────────────────────────────
  try {
    const sbRes = await fetch(
      `${SUPABASE_URL}/rest/v1/youtube_channels?is_active=eq.true&select=*`,
      { headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` } }
    );
    const channels = await sbRes.json();

    if (!channels?.length) {
      return res.status(200).json({ success: true, videos: [] });
    }

    const allVideos = [];
    for (const ch of channels) {
      try {
        const ytRes = await fetch(
          `https://www.googleapis.com/youtube/v3/search?` +
          `part=snippet&channelId=${ch.channel_id}&type=video&` +
          `videoEmbeddable=true&maxResults=3&order=date&` +
          `key=${GOOGLE_API_KEY}`
        );
        const ytData = await ytRes.json();
        if (ytData.items?.length) {
          ytData.items.forEach(item => {
            allVideos.push({
              id: item.id.videoId,
              title: item.snippet.title,
              channel: item.snippet.channelTitle,
              channelName: ch.name,
              thumb: item.snippet.thumbnails?.medium?.url ||
                `https://img.youtube.com/vi/${item.id.videoId}/mqdefault.jpg`,
              publishedAt: item.snippet.publishedAt,
            });
          });
        }
      } catch(e) {}
    }

    allVideos.sort((a,b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    return res.status(200).json({ success: true, videos: allVideos.slice(0, 5) });

  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}
