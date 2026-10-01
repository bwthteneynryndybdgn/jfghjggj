const config = require("../config");

module.exports = {
    name: "antistatus",
    aliases: ["autoreactstatus", "viewstatus"],
    category: "utility",
    description: "Toggle anti-status view or auto status viewing feature",

    async execute(context) {
        const { reply, react, args, isOwner, getUserConfig, updateUserConfig } = context;

        try {
            if (!isOwner) {
                return reply("❌ Only the owner can use this command!");
            }

            await react("👁️");

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
                const enabled = (userConfig.ANTI_STATUS || config.ANTI_STATUS) === 'true';
                return reply(
`╭━━━━ *ANTI STATUS MODE* ━━━━╮
┃
┃ 📊 *Current Status:* ${enabled ? '✅ ENABLED' : '❌ DISABLED'}
┃
┃ 📝 *Usage:*
┃ • .antistatus on
┃ • .antistatus off
┃
╰━━━━━━━━━━━━━━━━━━━━━━━╯

> © KAMRAN-MINI-BOT ッ`
                );
            }

            // ✅ ENABLE
            if (["on", "enable", "true"].includes(option)) {
                if (typeof updateUserConfig === "function") {
                    userConfig.ANTI_STATUS = 'true';
                    await updateUserConfig(userConfig);
                }
                process.env.ANTI_STATUS = 'true'; // Fallback
                await react("✅");
                return reply("✅ *Anti Status Enabled Successfully!*");
            }

            // ❌ DISABLE
            if (["off", "disable", "false"].includes(option)) {
                if (typeof updateUserConfig === "function") {
                    userConfig.ANTI_STATUS = 'false';
                    await updateUserConfig(userConfig);
                }
                process.env.ANTI_STATUS = 'false'; // Fallback
                await react("❌");
                return reply("❌ *Anti Status Disabled Successfully!*");
            }

            return reply("❌ Invalid option!\nUse: `.antistatus on` or `.antistatus off`");

        } catch (error) {
            console.error("Antistatus cmd error:", error);
            return reply(`❌ Error: ${error.message}`);
        }
    }
};
