const { updateUserConfig } = require("../lib/userConfigService");

module.exports = {
    name: "autoreact",
    aliases: ["antilink", "antidel", "antistatus", "mentionstatus", "welcome", "statusseen", "statuslike", "set"],
    category: "owner",
    description: "Toggle bot settings quickly",

    async execute(context) {
        const { reply, react, isOwner, command, q, sanitizedNumber } = context;

        try {
            if (!isOwner) {
                return reply("❌ Only the owner can use this command!");
            }

            let featureKey = "";
            let featureName = "";
            let action = "";

            // Agar command .set use ki hai aur aage feature diya hai (jaise: .set autoreact on)
            if (command === "set") {
                const args = q ? q.toLowerCase().split(" ") : [];
                featureKey = args[0];
                action = args[1];
            } else {
                // Agar direct command use ki hai (jaise: .autoreact on)
                featureKey = command;
                action = q ? q.toLowerCase().trim() : "";
            }

            if (action !== "on" && action !== "off") {
                return reply(`❌ Ghalat tareeqa! Use this format:\n• .${featureKey} on\n• .${featureKey} off`);
            }

            let configKey = "";
            switch (featureKey) {
                case "autoreact":
                    configKey = "AUTO_REACT";
                    featureName = "Auto-React";
                    break;
                case "antilink":
                    configKey = "ANTI_LINK";
                    featureName = "Anti-Link";
                    break;
                case "antidel":
                case "antidelete":
                    configKey = "ANTIDELETE";
                    featureName = "Anti-Delete";
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
                    return reply(`❌ Invalid command or setting!`);
            }

            const boolValue = (action === "on");
            await updateUserConfig(sanitizedNumber, { [configKey]: boolValue });
            
            await react("✅");
            return reply(`✅ Success! *${featureName}* ko *${action.toUpperCase()}* kar diya gaya hai.`);

        } catch (error) {
            console.error("Toggle error:", error);
            return reply(`❌ Error: ${error.message}`);
        }
    }
};
