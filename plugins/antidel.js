const config = require("../config");

module.exports = {
    name: "antidelete",
    aliases: ["antidel", "toggleantidelete"],
    category: "moderation",
    description: "Toggle anti-delete feature to catch deleted messages",

    async execute(context) {
        const { reply, react, args, isOwner, getUserConfig, updateUserConfig } = context;

        try {
            if (!isOwner) {
                return reply("❌ Only the owner can use this command!");
            }

            await react("🛡️");

            // Safe fallback agar getUserConfig function mojood na ho
            let userConfig = {};
            if (typeof getUserConfig === "function") {
                try {
                    userConfig = await getUserConfig() || {};
                } catch (e) {
                    userConfig = {};
                }
            }

            const option = args[0]?.toLowerCase();

            // 📊 STATUS CHECK
            if (!option) {
                const enabled = (userConfig.ANTI_DELETE || config.ANTI_DELETE) === 'true';
                return reply(
`╭━━━━ *ANTI DELETE MODE* ━━━━╮
┃
┃ 📊 *Current Status:* ${enabled ? '✅ ENABLED' : '❌ DISABLED'}
┃
┃ 📝 *Usage:*
┃ • .antidelete on
┃ • .antidelete off
┃
╰━━━━━━━━━━━━━━━━━━━━━━━╯

> © KAMRAN-MINI-BOT ッ`
                );
            }

            // ✅ ENABLE
            if (["on", "enable", "true"].includes(option)) {
                if (typeof updateUserConfig === "function") {
                    userConfig.ANTI_DELETE = 'true';
                    await updateUserConfig(userConfig);
                }
                process.env.ANTI_DELETE = 'true'; // Fallback
                await react("✅");
                return reply("✅ *Anti Delete Enabled Successfully!*");
            }

            // ❌ DISABLE
            if (["off", "disable", "false"].includes(option)) {
                if (typeof updateUserConfig === "function") {
                    userConfig.ANTI_DELETE = 'false';
                    await updateUserConfig(userConfig);
                }
                process.env.ANTI_DELETE = 'false'; // Fallback
                await react("❌");
                return reply("❌ *Anti Delete Disabled Successfully!*");
            }

            return reply("❌ Invalid option!\nUse: `.antidelete on` or `.antidelete off`");

        } catch (error) {
            console.error("Antidelete cmd error:", error);
            return reply(`❌ Error: ${error.message}`);
        }
    }
};
