const { loadUserConfig, updateUserConfig } = require("../lib/userConfigService");

module.exports = {
    name: "autoreact",
    aliases: ["setreact", "autoreaction"],
    category: "owner",
    description: "Enable or disable auto reaction to messages",

    async execute(context) {
        const { reply, react, isOwner, args, q, sanitizedNumber } = context;

        try {
            if (!isOwner) {
                return reply("❌ Only the owner can use this command!");
            }

            const action = (args[0] || q || "").toLowerCase().trim();

            if (action !== "on" && action !== "off") {
                return reply(`❌ Ghalat tareeqa! Sahi format use karein:\n\n• .autoreact on\n• .autoreact off`);
            }

            const currentConfig = await loadUserConfig(sanitizedNumber);
            const boolValue = (action === "on");
            
            // Auto-react keys update karna
            currentConfig.AUTO_REACT = boolValue;
            currentConfig.AUTOREACT = boolValue;

            await updateUserConfig(sanitizedNumber, currentConfig);

            if (typeof react === 'function') await react("✅");
            return reply(`✅ Success! *Auto-React* has been turned *${action.toUpperCase()}* successfully.`);

        } catch (error) {
            console.error("AutoReact CMD Error:", error);
            return reply(`❌ Error: ${error.message}`);
        }
    }
};
