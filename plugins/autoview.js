const config = require("../config");

module.exports = {
    name: "autoview",
    aliases: ["autoviewstatus", "viewstatus"],
    category: "utility",
    description: "Toggle auto view status feature",

    async execute(context) {
        const { reply, react, args, isOwner, getUserConfig, updateUserConfig } = context;

        try {
            if (!isOwner) return reply("❌ Only the owner can use this command!");
            await react("👁️");

            let userConfig = {};
            if (typeof getUserConfig === "function") {
                try { userConfig = await getUserConfig() || {}; } catch (e) { userConfig = {}; }
            }

            const option = args[0]?.toLowerCase();

            if (!option) {
                const enabled = (userConfig.AUTO_VIEW || config.AUTO_VIEW) === 'true';
                return reply(
`╭━━━━ *AUTO VIEW MODE* ━━━━╮
┃
┃ 📊 *Current Status:* ${enabled ? '✅ ENABLED' : '❌ DISABLED'}
┃
┃ 📝 *Usage:*
┃ • .autoview on
┃ • .autoview off
┃
╰━━━━━━━━━━━━━━━━━━━━━━━╯

> © KAMRAN-MINI-BOT ッ`
                );
            }

            if (["on", "enable", "true"].includes(option)) {
                if (typeof updateUserConfig === "function") {
                    userConfig.AUTO_VIEW = 'true';
                    await updateUserConfig(userConfig);
                }
                process.env.AUTO_VIEW = 'true';
                await react("✅");
                return reply("✅ *Auto View Enabled Successfully!*");
            }

            if (["off", "disable", "false"].includes(option)) {
                if (typeof updateUserConfig === "function") {
                    userConfig.AUTO_VIEW = 'false';
                    await updateUserConfig(userConfig);
                }
                process.env.AUTO_VIEW = 'false';
                await react("❌");
                return reply("❌ *Auto View Disabled Successfully!*");
            }

            return reply("❌ Invalid option!\nUse: `.autoview on` or `.autoview off`");
        } catch (error) {
            console.error("Autoview cmd error:", error);
            return reply(`❌ Error: ${error.message}`);
        }
    }
};
