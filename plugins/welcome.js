const config = require("../config");

module.exports = {
    name: "welcome",
    aliases: ["welcomeset", "setwelcome"],
    category: "utility",
    description: "Toggle welcome message feature",

    async execute(context) {
        const { reply, react, args, isOwner, getUserConfig, updateUserConfig } = context;

        try {
            if (!isOwner) {
                return reply("❌ Only the owner can use this command!");
            }

            await react("👋");

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
                const enabled = (userConfig.WELCOME || config.WELCOME) === 'true';
                return reply(
`╭━━━━ *WELCOME MESSAGE* ━━━━╮
┃
┃ 📊 *Current Status:* ${enabled ? '✅ ENABLED' : '❌ DISABLED'}
┃
┃ 📝 *Usage:*
┃ • .welcome on
┃ • .welcome off
┃
╰━━━━━━━━━━━━━━━━━━━━━━━╯

> © KAMRAN-MINI-BOT ッ`
                );
            }

            // ✅ ENABLE
            if (["on", "enable", "true"].includes(option)) {
                if (typeof updateUserConfig === "function") {
                    userConfig.WELCOME = 'true';
                    await updateUserConfig(userConfig);
                }
                process.env.WELCOME = 'true'; // Fallback
                await react("✅");
                return reply("✅ *Welcome Message Enabled Successfully!*");
            }

            // ❌ DISABLE
            if (["off", "disable", "false"].includes(option)) {
                if (typeof updateUserConfig === "function") {
                    userConfig.WELCOME = 'false';
                    await updateUserConfig(userConfig);
                }
                process.env.WELCOME = 'false'; // Fallback
                await react("❌");
                return reply("❌ *Welcome Message Disabled Successfully!*");
            }

            return reply("❌ Invalid option!\nUse: `.welcome on` or `.welcome off`");

        } catch (error) {
            console.error("Welcome cmd error:", error);
            return reply(`❌ Error: ${error.message}`);
        }
    }
};
