module.exports = {
    name: "set",
    aliases: ["antilink", "antistatus", "antimention", "antidel", "antidelete", "antiedit", "autoreact", "welcome", "statusseen", "statuslike"],
    category: "owner",
    description: "Enable or disable bot features quickly",

    async execute(context) {
        const { reply, react, isOwner, command, q, sanitizedNumber } = context;

        try {
            if (!isOwner) {
                return reply("❌ Only the owner can use this command!");
            }

            let featureKey = "";
            let action = "";

            if (command === "set") {
                const args = q ? q.toLowerCase().split(" ") : [];
                featureKey = args[0];
                action = args[1];
            } else {
                featureKey = command;
                action = q ? q.toLowerCase().trim() : "";
            }

            if (!featureKey || (action !== "on" && action !== "off")) {
                return reply(`❌ Ghalat tareeqa! Sahi format use karein:\n\n• .set antilink on/off\n• .set antistatus on/off\n• .set mentionstatus on/off\n• .set antidel on/off\n• .set antiedit on/off\n• .set autoreact on/off\n• .set welcome on/off\n• .set statusseen on/off\n• .set statuslike on/off`);
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

            // User config update service ko safe tarike se require karna taaki path ka error na aaye
            const { updateUserConfig } = require('../userConfigService') || require('./userConfigService') || {};
            
            if (typeof updateUserConfig === 'function') {
                const boolValue = (action === "on");
                await updateUserConfig(sanitizedNumber, { [configKey]: boolValue });
                await react("✅");
                return reply(`✅ Success! *${featureName}* ko successfully *${action.toUpperCase()}* kar diya gaya hai.`);
            } else {
                return reply(`❌ Error: Update service not found in this directory.`);
            }

        } catch (error) {
            console.error("Setting toggle error:", error);
            return reply(`❌ Error: ${error.message}`);
        }
    }
};
