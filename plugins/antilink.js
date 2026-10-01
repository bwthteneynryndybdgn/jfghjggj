const config = require("../config");

module.exports = {
    name: "antilink",
    aliases: ["antilinkmode", "linkblock"],
    category: "moderation",
    description: "Toggle anti-link feature to block or warn users sending links",

    async execute(context) {
        const { reply, react, args, isOwner, getUserConfig, updateUserConfig } = context;

        try {
            if (!isOwner) {
                return reply("❌ Only the owner can use this command!");
            }

            await react("🔗");

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
                const enabled = (userConfig.ANTI_LINK || config.ANTI_LINK) === 'true';
                return reply(
`╭━━━━ *ANTI LINK MODE* ━━━━╮
┃
┃ 📊 *Current Status:* ${enabled ? '✅ ENABLED' : '❌ DISABLED'}
┃
┃ 📝 *Usage:*
┃ • .antilink on
┃ • .antilink off
┃
╰━━━━━━━━━━━━━━━━━━━━━━━╯

> © KAMRAN-MINI-BOT ッ`
                );
            }

            // ✅ ENABLE
            if (["on", "enable", "true"].includes(option)) {
                if (typeof updateUserConfig === "function") {
                    userConfig.ANTI_LINK = 'true';
                    await updateUserConfig(userConfig);
                }
                process.env.ANTI_LINK = 'true'; // Fallback
                await react("✅");
                return reply("✅ *Anti Link Enabled Successfully!*");
            }

            // ❌ DISABLE
            if (["off", "disable", "false"].includes(option)) {
                if (typeof updateUserConfig === "function") {
                    userConfig.ANTI_LINK = 'false';
                    await updateUserConfig(userConfig);
                }
                process.env.ANTI_LINK = 'false'; // Fallback
                await react("❌");
                return reply("❌ *Anti Link Disabled Successfully!*");
            }

            return reply("❌ Invalid option!\nUse: `.antilink on` or `.antilink off`");

        } catch (error) {
            console.error("Antilink cmd error:", error);
            return reply(`❌ Error: ${error.message}`);
        }
    }
};
