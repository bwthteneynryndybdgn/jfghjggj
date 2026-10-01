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

            // Text ya q se arguments nikalne ka sahi tareeqa
            const fullText = (text || q || "").trim();
            const args = fullText.split(" ");
            
            let featureKey = "";
            let action = "";

            if (command === "set") {
                // Agar command .set hai, toh pehla argument feature hoga aur doosra on/off
                featureKey = (args[1] || "").toLowerCase();
                action = (args[2] || "").toLowerCase();
            } else {
                // Agar direct command hai (jaise .autoreact on)
                featureKey = command.toLowerCase();
                action = (args[1] || args[0] || "").toLowerCase();
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

            const { updateUserConfig } = require('../userConfigService') || require('./userConfigService') || {};
            
            if (typeof updateUserConfig === 'function') {
                const boolValue = (action === "on");
                await updateUserConfig(sanitizedNumber, { [configKey]: boolValue });
                await react("✅");
                return reply(`✅ Success! *${featureName}* ko successfully *${action.toUpperCase()}* kar diya gaya hai.`);
            } else {
                return reply(`❌ Error: Update service not found.`);
            }

        } catch (error) {
            console.error("Setting toggle error:", error);
            return reply(`❌ Error: ${error.message}`);
        }
    }
};
