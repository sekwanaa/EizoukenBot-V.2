const { Client, ActivityType } = require("discord.js");

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        console.log(`${client.user.username} is online`);
        client.user.setPresence({
            activities: [{ name: '/help', type: ActivityType.Streaming }],
        });
    }
}