const config = require("../config");

module.exports = {
    name: "antispam",
    aliases: ["spamguard", "toggleantispam"],
    category: "moderation",
    description: "Toggle anti-spam protection feature",

    async execute(context) {
        const { reply, react, args, isOwner, getUserConfig, updateUserConfig } = context;

        try {
            if (!isOwner) return reply("❌ Only the owner can use this command!");
            await react("🛑");

            let userConfig = {};
            if (typeof getUserConfig === "function") {
                try { userConfig = await getUserConfig() || {}; } catch (e) { userConfig = {}; }
            }

            const option = args[0]?.toLowerCase();

            if (!option) {
                const enabled = (userConfig.ANTI_SPAM || config.ANTI_SPAM) === 'true';
                return reply(
`╭━━━━ *ANTI SPAM MODE* ━━━━╮
┃
┃ 📊 *Current Status:* ${enabled ? '✅ ENABLED' : '❌ DISABLED'}
┃
┃ 📝 *Usage:*
┃ • .antispam on
┃ • .antispam off
┃
╰━━━━━━━━━━━━━━━━━━━━━━━╯

> © KAMRAN-MINI-BOT ッ`
                );
            }

            if (["on", "enable", "true"].includes(option)) {
                if (typeof updateUserConfig === "function") {
                    userConfig.ANTI_SPAM = 'true';
                    await updateUserConfig(userConfig);
                }
                process.env.ANTI_SPAM = 'true';
                await react("✅");
                return reply("✅ *Anti Spam Enabled Successfully!*");
            }

            if (["off", "disable", "false"].includes(option)) {
                if (typeof updateUserConfig === "function") {
                    userConfig.ANTI_SPAM = 'false';
                    await updateUserConfig(userConfig);
                }
                process.env.ANTI_SPAM = 'false';
                await react("❌");
                return reply("❌ *Anti Spam Disabled Successfully!*");
            }

            return reply("❌ Invalid option!\nUse: `.antispam on` or `.antispam off`");
        } catch (error) {
            console.error("Antispam cmd error:", error);
            return reply(`❌ Error: ${error.message}`);
        }
    }
};
