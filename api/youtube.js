export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  if (!GOOGLE_API_KEY) return res.status(500).json({ error: "API key not configured" });

  const SUPABASE_URL = "https://klesgczkebudkuidhflc.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsZXNnY3prZWJ1ZGt1aWRoZmxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzOTE1MjksImV4cCI6MjA4ODk2NzUyOX0.ZKAAmR2yj9Aia-1-q_3ZAOfx-95MnW9OWz9jpr2qxfw";

  // ── POST: URL 또는 @핸들로 채널 조회 ────────────────────
  if (req.method === "POST") {
    const { handle } = req.body;
    if (!handle) return res.status(400).json({ error: "handle required" });

    let cleanHandle = handle.trim();
    const handleMatch = cleanHandle.match(/@([\w-]+)/);
    if (handleMatch) {
      cleanHandle = handleMatch[1];
    } else {
      const pathMatch = cleanHandle.match(/youtube\.com\/(?:c\/|channel\/|user\/)?([^/?&]+)/i);
      if (pathMatch) cleanHandle = pathMatch[1];
      else cleanHandle = cleanHandle.replace(/^@/, "").split("?")[0].trim();
    }

    if (!cleanHandle) {
      return res.status(200).json({ error: "유효한 유튜브 URL이나 @핸들을 입력해주세요." });
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?` +
        `part=id,snippet&forHandle=${cleanHandle}&key=${GOOGLE_API_KEY}`
      );
      const data = await response.json();

      if (!data.items?.length) {
        return res.status(200).json({
          error: `"@${cleanHandle}" 채널을 찾을 수 없어요. URL을 다시 확인해주세요.`
        });
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
  // playlistItems API 사용 (quota: 1 unit vs search의 100 unit)
  // uploads 플레이리스트 ID = channel_id의 "UC" → "UU" 치환
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
        // uploads 플레이리스트 ID 계산 (UC → UU)
        const uploadsPlaylistId = ch.channel_id.replace(/^UC/, "UU");

        const ytRes = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?` +
          `part=snippet&playlistId=${uploadsPlaylistId}&maxResults=8&` +
          `key=${GOOGLE_API_KEY}`
        );
        const ytData = await ytRes.json();

        if (ytData.items?.length) {
          ytData.items.forEach(item => {
            const snippet = item.snippet;
            const videoId = snippet?.resourceId?.videoId;
            if (!videoId) return;

            const title = snippet.title || "";
            // Shorts 필터링 (제목 또는 설명에 #Shorts 포함)
            const isShorts = /shorts/i.test(title) || /^#shorts/i.test(snippet.description || "");
            // 삭제된 영상 필터
            const isDeleted = title === "Private video" || title === "Deleted video";
            if (!isShorts && !isDeleted) {
              allVideos.push({
                id: videoId,
                title,
                channel: snippet.channelTitle,
                channelName: ch.name,
                thumb: snippet.thumbnails?.medium?.url ||
                  `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
                publishedAt: snippet.publishedAt,
              });
            }
          });
        }
      } catch(e) {
        // 채널 하나 실패해도 계속 진행
      }
    }

    allVideos.sort((a,b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    return res.status(200).json({ success: true, videos: allVideos.slice(0, 5) });

  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}
