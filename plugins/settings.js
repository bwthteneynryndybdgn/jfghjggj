module.exports = {
    name: "antidelete",
    aliases: ["antidel", " antideletemsg"],
    category: "utility",
    description: "Toggle anti-delete message tracking",

    async execute(context) {
        const { reply, react, args, isOwner, getUserConfig, updateUserConfig } = context;

        try {
            if (!isOwner) {
                return reply("❌ Only the owner can use this command!");
            }

            await react("🗑️");

            const userConfig = await getUserConfig();
            const option = args[0]?.toLowerCase();

            // 📊 STATUS CHECK
            if (!option) {
                const enabled = userConfig.ANTIDELETE === 'true';
                return reply(
`╭━━━━ *ANTI DELETE MODE* ━━━━╮
┃
┃ 📊 *Current Status:* ${enabled ? '✅ ENABLED' : '❌ DISABLED'}
┃
┃ 📝 *Usage:*
┃ • .antidelete on
┃ • .antidelete off
┃
┃ ℹ️ Bot will catch and resend 
┃ deleted messages
┃
╰━━━━━━━━━━━━━━━━━━━━━━━╯

> © KAMRAN-MD ッ`
                );
            }

            // ✅ ENABLE
            if (["on", "enable", "true"].includes(option)) {
                userConfig.ANTIDELETE = 'true';
                await updateUserConfig(userConfig);
                await react("✅");
                return reply(
`✅ *Anti-Delete Enabled!*

Bot will now capture and send deleted messages.`
                );
            }

            // ❌ DISABLE
            if (["off", "disable", "false"].includes(option)) {
                userConfig.ANTIDELETE = 'false';
                await updateUserConfig(userConfig);
                await react("❌");
                return reply(
`❌ *Anti-Delete Disabled!*

Bot will no longer track deleted messages.`
                );
            }

            return reply("❌ Invalid option!\nUse: `.antidelete on` or `.antidelete off`");

        } catch (error) {
            console.error("AntiDelete error:", error);
            return reply("❌ Something went wrong while updating anti-delete setting.");
        }
    }
};
