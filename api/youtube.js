export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  if (!GOOGLE_API_KEY) return res.status(500).json({ error: "API key not configured" });

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?` +
      `part=snippet&q=볼링&type=video&` +
      `relevanceLanguage=ko&regionCode=KR&` +
      `videoCategoryId=17&` +
      `videoEmbeddable=true&` +
      `maxResults=10&` +
      `order=viewCount&` +
      `key=${GOOGLE_API_KEY}`
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(200).json({ error: data.error?.message || "YouTube API error" });
    }

    const videos = (data.items || []).map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      thumb: item.snippet.thumbnails?.medium?.url || `https://img.youtube.com/vi/${item.id.videoId}/mqdefault.jpg`,
      publishedAt: item.snippet.publishedAt,
    }));

    return res.status(200).json({ success: true, videos });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
