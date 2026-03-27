export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  if (!GOOGLE_API_KEY) return res.status(500).json({ error: "API key not configured" });

  const SUPABASE_URL = "https://klesgczkebudkuidhflc.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsZXNnY3prZWJ1ZGt1aWRoZmxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzOTE1MjksImV4cCI6MjA4ODk2NzUyOX0.ZKAAmR2yj9Aia-1-q_3ZAOfx-95MnW9OWz9jpr2qxfw";

  try {
    // 1. Supabase에서 활성 채널 목록
    const sbRes = await fetch(
      `${SUPABASE_URL}/rest/v1/youtube_channels?is_active=eq.true&select=*`,
      { headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` } }
    );
    const channels = await sbRes.json();

    if (!channels?.length) {
      return res.status(200).json({ success: true, videos: [] });
    }

    // 2. 각 채널 최신 영상 가져오기
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
      } catch(e) { /* 채널 오류 무시 */ }
    }

    // 3. 날짜순 정렬
    allVideos.sort((a,b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    return res.status(200).json({ success: true, videos: allVideos.slice(0, 10) });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
