const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "../database");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const settingsPath = path.join(dataDir, "bot_settings.json");

function loadBotSettings() {
  try {
    if (fs.existsSync(settingsPath)) {
      return JSON.parse(fs.readFileSync(settingsPath, "utf8"));
    }
    return {};
  } catch (e) {
    console.error("Load Error:", e);
    return {};
  }
}

function saveBotSettings(data) {
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Save Error:", e);
  }
}

module.exports = {
  name: "set",
  aliases: ["antilink", "antistatus", "antimention", "antidel", "antidelete", "antiedit", "autoreact", "statusseen", "statuslike"],
  category: "owner",
  description: "Enable or disable bot settings quickly",

  async execute(context) {
    const { reply, react, command, args, q, isBotOwner, sender } = context;

    // Owner number check
    const ownerNumber = "923147168309";
    const senderNumber = sender ? sender.split('@')[0] : "";
    const isOwner = isBotOwner || senderNumber === ownerNumber;

    if (!isOwner) {
      return reply("❌ Only the owner can use this command!");
    }

    try {
      const settings = loadBotSettings();
      const cmd = (command || "").toLowerCase();
      let feature = "";
      let action = "";

      if (cmd === "set") {
        feature = args[0] ? args[0].toLowerCase() : "";
        action = args[1] ? args[1].toLowerCase() : "";
      } else {
        feature = cmd;
        action = args[0] ? args[0].toLowerCase() : (q ? q.toLowerCase().trim() : "");
      }

      const validFeatures = ["antilink", "antistatus", "mentionstatus", "antimention", "antidel", "antidelete", "antiedit", "autoreact", "statusseen", "statuslike"];

      if (!validFeatures.includes(feature) || !["on", "off"].includes(action)) {
        return reply(`❌ Ghalat tareeqa! Sahi format use karein:\n\n• .set antilink on/off\n• .autoreact on/off\n• .set antistatus on/off`);
      }

      // Key standardization
      let configKey = feature;
      if (feature === "antidelete") configKey = "antidel";
      if (feature === "antimention") configKey = "mentionstatus";
      if (feature === "autoview") configKey = "statusseen";
      if (feature === "autolike") configKey = "statuslike";

      settings[configKey] = (action === "on");
      saveBotSettings(settings);

      if (react) await react("✅");
      return reply(`✅ Success! *${feature.toUpperCase()}* has been turned *${action.toUpperCase()}* successfully.`);

    } catch (error) {
      console.error("Settings CMD Error:", error);
      return reply("❌ Something went wrong while saving settings.");
    }
  }
};
