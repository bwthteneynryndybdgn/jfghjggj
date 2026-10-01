const yts = require("yt-search");
const axios = require("axios");

module.exports = {
  name: "video",
  alias: ["vid", "ytmp4", "mp4"],
  category: "download",
  desc: "Download videos using OfficialHectoManuel API",

  async execute(context) {
    const { socket, sock, conn, from, q, reply, m, react } = context;
    const bot = socket || sock || conn;

    try {
      if (!q) {
        return reply("❓ Example: .video Alone Alan Walker");
      }

      // Search Reaction
      await react("🔍");

      // Search Video
      const search = await yts(q);

      if (!search || !search.videos.length) {
        return reply("❌ No results found!");
      }

      const vid = search.videos[0];

      // Caption
      const caption = `╭━━〔 🎬 VIDEO FOUND 〕━━━╮
┃ 🏷️ Title : ${vid.title}
┃ ⏱️ Duration : ${vid.timestamp}
┃ 👁️ Views : ${vid.views.toLocaleString()}
╰━━━━━━━━━━━━━━━━━╯

⏳ Downloading video...`;

      // Send Thumbnail
      await bot.sendMessage(
        from,
        {
          image: { url: vid.thumbnail },
          caption: caption
        },
        { quoted: m }
      );

      await react("⏳");

      // Download Video (API Endpoint)
      const api = `https://yt-dl.officialhectormanuel.workers.dev/?url=${encodeURIComponent(
        vid.url
      )}`;

      const { data } = await axios.get(api);

      // Check if video link is available in response (commonly data.video or data.mp4, adjusting based on API)
      const videoUrl = data.video || data.mp4 || data.download;

      if (!data || !data.status || !videoUrl) {
        return reply("❌ Could not fetch video. Try another query.");
      }

      // Send Video
      await bot.sendMessage(
        from,
        {
          video: { url: videoUrl },
          mimetype: "video/mp4",
          fileName: `${vid.title}.mp4`,
          caption: `🎬 *${vid.title}*`
        },
        { quoted: m }
      );

      await react("✅");
    } catch (err) {
      console.error(err);
      await react("❌");
      reply("⚠️ Download failed: " + err.message);
    }
  }
};
