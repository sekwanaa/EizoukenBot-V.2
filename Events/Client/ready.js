require("dotenv")
const { Client } = require("discord.js");
const mongodb = require("mongodb")

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        console.log(`${client.user.username} is online`);
        client.user.setActivity(`| .help |`);
    }
}