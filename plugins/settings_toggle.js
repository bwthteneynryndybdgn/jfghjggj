const { loadUserConfig, updateUserConfig } = require("../lib/userConfigService");

module.exports = {
    name: "set",
    aliases: ["antilink", "antistatus", "antimention", "antidel", "antidelete", "antiedit", "autoreact", "welcome", "statusseen", "statuslike"],
    category: "owner",
    description: "Enable or disable bot features quickly",

    async execute(context) {
        const { reply, react, isOwner, command, text, q, sanitizedNumber } = context;

        try {
            if (!isOwner) {
                return reply("❌ Only the owner can use this command!");
            }

            const cmd = typeof command === 'string' ? command.toLowerCase().trim() : "";
            const messageBody = typeof text === 'string' ? text.trim() : (typeof q === 'string' ? q.trim() : "");
            const parts = messageBody ? messageBody.split(/\s+/) : [];

            let featureKey = "";
            let action = "";

            if (cmd === "set") {
                featureKey = (parts[0] || "").toLowerCase();
                action = (parts[1] || "").toLowerCase();
            } else {
                featureKey = cmd;
                action = (parts[0] || "").toLowerCase();
            }

            if (!featureKey || (action !== "on" && action !== "off")) {
                return reply(`❌ Ghalat tareeqa! Sahi format use karein:\n\n• .set autoreact on/off\n• .autoreact on/off\n• .set antilink on/off`);
            }

            let configKey = "";
            let featureName = "";

            switch (featureKey) {
                case "antilink":
                    configKey = "ANTI_LINK";
                    featureName = "Anti-Link";
                    break;
                case "antistatus":
                    configKey = "ANTISTATUS";
                    featureName = "Anti-Status";
                    break;
                case "mentionstatus":
                case "antimention":
                    configKey = "ANTI_MENTION";
                    featureName = "Anti-Mention";
                    break;
                case "antidel":
                case "antidelete":
                    configKey = "ANTIDELETE";
                    featureName = "Anti-Delete";
                    break;
                case "antiedit":
                    configKey = "ANTIEDIT";
                    featureName = "Anti-Edit";
                    break;
                case "autoreact":
                    configKey = "AUTO_REACT";
                    featureName = "Auto-React";
                    break;
                case "welcome":
                    configKey = "WELCOME";
                    featureName = "Welcome Message";
                    break;
                case "statusseen":
                case "autoview":
                    configKey = "AUTO_VIEW_STATUS";
                    featureName = "Auto Status Seen";
                    break;
                case "statuslike":
                case "autolike":
                    configKey = "AUTO_LIKE_STATUS";
                    featureName = "Auto Status Like";
                    break;
                default:
                    return reply(`❌ Invalid feature name! Sahi command likhein.`);
            }

            // Pehle current user config load karein taaki purani settings overwrite na hon
            const currentConfig = await loadUserConfig(sanitizedNumber);
            
            // Nayi value set karein
            const boolValue = (action === "on");
            currentConfig[configKey] = boolValue;

            // Updated config ko database mein save karein
            await updateUserConfig(sanitizedNumber, currentConfig);

            if (typeof react === 'function') await react("✅");
            return reply(`✅ Success! *${featureName}* ko successfully *${action.toUpperCase()}* kar diya gaya hai.`);

        } catch (error) {
            console.error("Setting toggle error:", error);
            return reply(`❌ Error: ${error.message}`);
        }
    }
};
