const { Client } = require("discord.js");

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        console.log(`${client.user.username} is online`);
        client.user.setActivity(`| ?help |`);
    }
}