module.exports = {
  name: "autoreact",
  aliases: ["customautoreact"],
  async execute({ socket, msg, args, sender, sanitizedNumber, loadUserConfig, updateUserConfig }) {
    try {
      const option = (args[0] || "").toLowerCase();
      const userConfig = await loadUserConfig(sanitizedNumber);

      if (!["on", "off"].includes(option)) {
        const status = userConfig.AUTO_REACT === "true";
        return await socket.sendMessage(
          sender,
          { text: `🤖 Auto React is currently ${status ? "✅ ON" : "❌ OFF"}\n\nUse:\n.autoreact on\n.autoreact off` },
          { quoted: msg }
        );
      }

      userConfig.AUTO_REACT = option === "on" ? "true" : "false";
      await updateUserConfig(sanitizedNumber, userConfig);

      await socket.sendMessage(
        sender,
        { text: `✅ Auto React ${option === "on" ? "Enabled" : "Disabled"}` },
        { quoted: msg }
      );

    } catch (e) {
      console.log("Autoreact cmd error:", e);
      await socket.sendMessage(
        sender,
        { text: "❌ Error while changing Auto React setting." },
        { quoted: msg }
      );
    }
  },
};
