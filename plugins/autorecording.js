const config = require("../config");

module.exports = {
    name: "autorecording",
    aliases: ["autorecord", "setrecording"],
    category: "utility",
    description: "Toggle auto recording status feature",

    async execute(context) {
        const { reply, react, args, isOwner, getUserConfig, updateUserConfig } = context;

        try {
            if (!isOwner) return reply("❌ Only the owner can use this command!");
            await react("🎙️");

            let userConfig = {};
            if (typeof getUserConfig === "function") {
                try { userConfig = await getUserConfig() || {}; } catch (e) { userConfig = {}; }
            }

            const option = args[0]?.toLowerCase();

            if (!option) {
                const enabled = (userConfig.AUTO_RECORDING || config.AUTO_RECORDING) === 'true';
                return reply(
`╭━━━ *AUTO RECORDING* ━━━╮
┃
┃ 📊 *Current Status:* ${enabled ? '✅ ENABLED' : '❌ DISABLED'}
┃
┃ 📝 *Usage:*
┃ • .autorecording on
┃ • .autorecording off
┃
╰━━━━━━━━━━━━━━━━━━━━━━━╯

> © KAMRAN-MINI-BOT ッ`
                );
            }

            if (["on", "enable", "true"].includes(option)) {
                if (typeof updateUserConfig === "function") {
                    userConfig.AUTO_RECORDING = 'true';
                    await updateUserConfig(userConfig);
                }
                process.env.AUTO_RECORDING = 'true';
                await react("✅");
                return reply("✅ *Auto Recording Enabled Successfully!*");
            }

            if (["off", "disable", "false"].includes(option)) {
                if (typeof updateUserConfig === "function") {
                    userConfig.AUTO_RECORDING = 'false';
                    await updateUserConfig(userConfig);
                }
                process.env.AUTO_RECORDING = 'false';
                await react("❌");
                return reply("❌ *Auto Recording Disabled Successfully!*");
            }

            return reply("❌ Invalid option!\nUse: `.autorecording on` or `.autorecording off`");
        } catch (error) {
            console.error("Autorecording cmd error:", error);
            return reply(`❌ Error: ${error.message}`);
        }
    }
};
