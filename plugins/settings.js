const config = require("../config"); // Path theek kar liya hai

module.exports = {
    name: "autoreact",
    aliases: ["autoreaction", "setreact"],
    category: "utility",
    description: "Toggle auto reaction feature",

    async execute(context) {
        const { reply, react, args, isOwner, getUserConfig, updateUserConfig } = context;

        try {
            if (!isOwner) {
                return reply("❌ Only the owner can use this command!");
            }

            await react("💖");

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
                const enabled = (userConfig.AUTO_REACT || config.AUTO_REACT) === 'true';
                return reply(
`╭━━━━ *AUTO REACT MODE* ━━━━╮
┃
┃ 📊 *Current Status:* ${enabled ? '✅ ENABLED' : '❌ DISABLED'}
┃
┃ 📝 *Usage:*
┃ • .autoreact on
┃ • .autoreact off
┃
╰━━━━━━━━━━━━━━━━━━━━━━━╯

> © KAMRAN-MINI-BOT ッ`
                );
            }

            // ✅ ENABLE
            if (["on", "enable", "true"].includes(option)) {
                if (typeof updateUserConfig === "function") {
                    userConfig.AUTO_REACT = 'true';
                    await updateUserConfig(userConfig);
                }
                process.env.AUTO_REACT = 'true'; // Fallback
                await react("✅");
                return reply("✅ *Auto React Enabled Successfully!*");
            }

            // ❌ DISABLE
            if (["off", "disable", "false"].includes(option)) {
                if (typeof updateUserConfig === "function") {
                    userConfig.AUTO_REACT = 'false';
                    await updateUserConfig(userConfig);
                }
                process.env.AUTO_REACT = 'false'; // Fallback
                await react("❌");
                return reply("❌ *Auto React Disabled Successfully!*");
            }

            return reply("❌ Invalid option!\nUse: `.autoreact on` or `.autoreact off`");

        } catch (error) {
            console.error("Autoreact cmd error:", error);
            return reply(`❌ Error: ${error.message}`);
        }
    }
};
