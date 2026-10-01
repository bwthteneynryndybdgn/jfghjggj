const config = require("../config");

module.exports = {
    name: "settings",
    aliases: ["botsettings", "config"],
    category: "owner",
    description: "View all bot settings",

    async execute(context) {
        const { reply, react, isOwner, getUserConfig, number } = context;

        try {
            if (!isOwner) {
                return reply("❌ Only the owner can use this command!");
            }

            await react("⚙️");
            const userConfig = await getUserConfig();
            
            const settings = {
                prefix: userConfig.PREFIX || config.PREFIX || '.',
                mode: userConfig.MODE || config.MODE || 'public',
                anticall: userConfig.ANTICALL === 'true' || userConfig.ANTICALL === true ? '✅' : '❌',
                antiedit: userConfig.ANTIEDIT !== 'false' && userConfig.ANTIEDIT !== false ? '✅' : '❌',
                antidelete: userConfig.ANTIDELETE !== 'false' && userConfig.ANTIDELETE !== false ? '✅' : '❌',
                autoview: userConfig.AUTO_VIEW_STATUS === 'true' || userConfig.AUTO_VIEW_STATUS === true ? '✅' : '❌',
                autoreact: userConfig.AUTO_REACT === 'true' || userConfig.AUTO_REACT === true ? '✅' : '❌',
                antilink: userConfig.ANTI_LINK === 'true' || userConfig.ANTI_LINK === true ? '✅' : '❌',
                antistatus: userConfig.ANTISTATUS === 'true' || userConfig.ANTISTATUS === true ? '✅' : '❌',
                antimention: userConfig.ANTI_MENTION === 'true' || userConfig.ANTI_MENTION === true ? '✅' : '❌',
                welcome: userConfig.WELCOME === 'true' || userConfig.WELCOME === true ? '✅' : '❌',
                autolikestatus: userConfig.AUTO_LIKE_STATUS === 'true' || userConfig.AUTO_LIKE_STATUS === true ? '✅' : '❌',
            };

            const statusText = `╭━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  ⚙️ *BOT SETTINGS MENU*
┃━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ 📱 *Number:* ${number || 'Unknown'}
┃━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ 🎯 *Prefix:* ${settings.prefix}
┃ 🌐 *Mode:* ${settings.mode === 'public' ? '🌐 PUBLIC' : '🔒 PRIVATE'}
┃━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ 📵 *Anti-Call:* ${settings.anticall}
┃ 🔗 *Anti-Link:* ${settings.antilink}
┃ 🛡️ *Anti-Status:* ${settings.antistatus}
┃ 👤 *Anti-Mention:* ${settings.antimention}
┃ ✏️ *Anti-Edit:* ${settings.antiedit}
┃ 🗑️ *Anti-Delete:* ${settings.antidelete}
┃━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ 👀 *Status Seen (View):* ${settings.autoview}
┃ ❤️ *Status Like:* ${settings.autolikestatus}
┃ 💝 *Auto React:* ${settings.autoreact}
┃ 👋 *Welcome Msg:* ${settings.welcome}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📝 *Available Quick Commands:*
• .set antilink on/off
• .set antistatus on/off
• .set mentionstatus on/off
• .set antidel on/off
• .set antiedit on/off
• .set autoreact on/off
• .set welcome on/off
• .set statusseen on/off
• .set statuslike on/off

> © KAMRAN-MD ッ`;

            await react("✅");
            return reply(statusText);

        } catch (error) {
            console.error("Settings error:", error);
            return reply(`❌ Error: ${error.message}`);
        }
    }
};
