module.exports = {
  name: "onoff",
  alias: ["setting", "toggle"],
  desc: "Bot ke features ko on ya off karne ke liye",
  category: "owner",
  use: ".onoff <feature> <on/off>",
  async execute(conn, mek, m, { args, isOwner, reply }) {
    // Sirf Owner ya Sudo users ke liye allow karein
    if (!isOwner) return reply("❌ Yeh command sirf bot ka owner use kar sakta hai!");

    if (args.length < 2) {
      return reply(
        "⚙️ **Usage Example:**\n" +
        "• `.onoff antilink on`\n" +
        "• `.onoff anticall off`\n\n" +
        "📋 **Available Features:**\n" +
        "• `antilink`\n" +
        "• `autoview`\n" +
        "• `antidelete`\n" +
        "• `anticall`\n" +
        "• `autorecord`\n" +
        "• `antiedit`\n" +
        "• `antimention`\n" +
        "• `antibug`"
      );
    }

    const featureKey = args[0].toLowerCase();
    const action = args[1].toLowerCase();

    if (!["on", "off"].includes(action)) {
      return reply("❌ Invalid action! Please use `on` or `off`.");
    }

    const status = action === "on" ? "true" : "false";
    let targetSetting = "";

    // Feature mapping aapke config ke mutabiq
    switch (featureKey) {
      case "antilink":
        targetSetting = "ANTI_LINK";
        break;
      case "autoview":
        targetSetting = "AUTO_VIEW_STATUS";
        break;
      case "antidelete":
        targetSetting = "ANTIDELETE";
        break;
      case "anticall":
        targetSetting = "ANTICALL";
        break;
      case "autorecord":
        targetSetting = "AUTO_RECORDING";
        break;
      case "antiedit":
        targetSetting = "ANTIEDIT";
        break;
      case "antimention":
        targetSetting = "ANTI_MENTION";
        break;
      case "antibug":
        targetSetting = "ANTI_BUG";
        break;
      default:
        return reply("❌ Yeh feature list mein maujood nahi hai!");
    }

    // Runtime par process.env update karna taake bot restart kiye bina kaam kare
    process.env[targetSetting] = status;

    // Success response
    return reply(
      `✅ Success!\n\n` +
      `🛠️ **Feature:** ${targetSetting}\n` +
      `📊 **Status:** ${status === "true" ? "🟢 ON (Enabled)" : "🔴 OFF (Disabled)"}`
    );
  }
};
