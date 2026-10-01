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

      // Download Video API
      const api = `https://yt-dl.officialhectormanuel.workers.dev/?url=${encodeURIComponent(
        vid.url
      )}`;

      const { data } = await axios.get(api);

      if (!data || !data.status || !data.videos) {
        return reply("❌ Could not fetch video. Try another query.");
      }

      // API response ke mutabiq 360p ya available pehli video quality select karna
      const videoUrl = data.videos["360"] || data.videos["270"] || data.videos[Object.keys(data.videos)[0]];

      if (!videoUrl) {
        return reply("❌ Video stream not found in this quality.");
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
