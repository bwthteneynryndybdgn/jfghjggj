const config = require("../config");

module.exports = {
    name: "autolikestatus",
    aliases: ["autolikestatus", "statuslike"],
    category: "utility",
    description: "Toggle auto like status feature",

    async execute(context) {
        const { reply, react, args, isOwner, getUserConfig, updateUserConfig } = context;

        try {
            if (!isOwner) return reply("❌ Only the owner can use this command!");
            await react("💖");

            let userConfig = {};
            if (typeof getUserConfig === "function") {
                try { userConfig = await getUserConfig() || {}; } catch (e) { userConfig = {}; }
            }

            const option = args[0]?.toLowerCase();

            if (!option) {
                const enabled = (userConfig.AUTO_LIKE_STATUS || config.AUTO_LIKE_STATUS) === 'true';
                return reply(
`╭━━━ *AUTO LIKE STATUS* ━━━╮
┃
┃ 📊 *Current Status:* ${enabled ? '✅ ENABLED' : '❌ DISABLED'}
┃
┃ 📝 *Usage:*
┃ • .autolikestatus on
┃ • .autolikestatus off
┃
╰━━━━━━━━━━━━━━━━━━━━━━━╯

> © KAMRAN-MINI-BOT ッ`
                );
            }

            if (["on", "enable", "true"].includes(option)) {
                if (typeof updateUserConfig === "function") {
                    userConfig.AUTO_LIKE_STATUS = 'true';
                    await updateUserConfig(userConfig);
                }
                process.env.AUTO_LIKE_STATUS = 'true';
                await react("✅");
                return reply("✅ *Auto Like Status Enabled Successfully!*");
            }

            if (["off", "disable", "false"].includes(option)) {
                if (typeof updateUserConfig === "function") {
                    userConfig.AUTO_LIKE_STATUS = 'false';
                    await updateUserConfig(userConfig);
                }
                process.env.AUTO_LIKE_STATUS = 'false';
                await react("❌");
                return reply("❌ *Auto Like Status Disabled Successfully!*");
            }

            return reply("❌ Invalid option!\nUse: `.autolikestatus on` or `.autolikestatus off`");
        } catch (error) {
            console.error("Autolikestatus cmd error:", error);
            return reply(`❌ Error: ${error.message}`);
        }
    }
};
