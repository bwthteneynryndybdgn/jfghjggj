const config = require("../config");

module.exports = {
    name: "antibot",
    aliases: ["botblock", "toggleantibot"],
    category: "moderation",
    description: "Toggle anti-bot feature to block other bots",

    async execute(context) {
        const { reply, react, args, isOwner, getUserConfig, updateUserConfig } = context;

        try {
            if (!isOwner) return reply("❌ Only the owner can use this command!");
            await react("🤖");

            let userConfig = {};
            if (typeof getUserConfig === "function") {
                try { userConfig = await getUserConfig() || {}; } catch (e) { userConfig = {}; }
            }

            const option = args[0]?.toLowerCase();

            if (!option) {
                const enabled = (userConfig.ANTI_BOT || config.ANTI_BOT) === 'true';
                return reply(
`╭━━━━ *ANTI BOT MODE* ━━━━╮
┃
┃ 📊 *Current Status:* ${enabled ? '✅ ENABLED' : '❌ DISABLED'}
┃
┃ 📝 *Usage:*
┃ • .antibot on
┃ • .antibot off
┃
╰━━━━━━━━━━━━━━━━━━━━━━━╯

> © KAMRAN-MINI-BOT ッ`
                );
            }

            if (["on", "enable", "true"].includes(option)) {
                if (typeof updateUserConfig === "function") {
                    userConfig.ANTI_BOT = 'true';
                    await updateUserConfig(userConfig);
                }
                process.env.ANTI_BOT = 'true';
                await react("✅");
                return reply("✅ *Anti Bot Enabled Successfully!*");
            }

            if (["off", "disable", "false"].includes(option)) {
                if (typeof updateUserConfig === "function") {
                    userConfig.ANTI_BOT = 'false';
                    await updateUserConfig(userConfig);
                }
                process.env.ANTI_BOT = 'false';
                await react("❌");
                return reply("❌ *Anti Bot Disabled Successfully!*");
            }

            return reply("❌ Invalid option!\nUse: `.antibot on` or `.antibot off`");
        } catch (error) {
            console.error("Antibot cmd error:", error);
            return reply(`❌ Error: ${error.message}`);
        }
    }
};
