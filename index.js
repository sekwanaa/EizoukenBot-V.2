require('dotenv').config();

const { BOT_TOKEN } = process.env;

const { Client, GatewayIntentBits, User, Message, GuildMember, ThreadMember } = require(`discord.js`);

const prefix = ".";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
  partials: [
    User,
    Message, 
    GuildMember,
    ThreadMember,
  ],
});

const { loadEvents } = require("./Handlers/eventHandler");

client.login(BOT_TOKEN).then(() => {
    loadEvents(client, prefix);
});
