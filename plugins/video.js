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

      await react("🔍");

      const search = await yts(q);
      if (!search || !search.videos.length) {
        return reply("❌ No results found!");
      }

      const vid = search.videos[0];

      const caption = `╭━━〔 🎬 VIDEO FOUND 〕━━━╮
┃ 🏷️ Title : ${vid.title}
┃ ⏱️ Duration : ${vid.timestamp}
┃ 👁️ Views : ${vid.views.toLocaleString()}
╰━━━━━━━━━━━━━━━━━╯

⏳ Downloading video...`;

      await bot.sendMessage(
        from,
        {
          image: { url: vid.thumbnail },
          caption: caption
        },
        { quoted: m }
      );

      await react("⏳");

      const api = `https://yt-dl.officialhectormanuel.workers.dev/?url=${encodeURIComponent(
        vid.url
      )}`;

      const { data } = await axios.get(api);
      
      // Console mein check karne ke liye ki API kya bhej rahi hai
      console.log("API Response:", data);

      // Sabhi possible video keys ko check kar rahe hain
      const videoUrl = data.video || data.mp4 || data.download || data.url || data.result;

      if (!data || !videoUrl) {
        return reply("❌ Could not fetch video. API response didn't include a video link.");
      }

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
