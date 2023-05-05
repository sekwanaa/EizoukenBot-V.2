require('dotenv').config();

const { BOT_TOKEN } = process.env;

const { Client, GatewayIntentBits, User, Message, GuildMember, ThreadMember, Collection } = require(`discord.js`);

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

client.commands = new Collection()

const { loadEvents } = require("./Handlers/eventHandler");
const { loadCommands } = require("./Handlers/commandHandler");

client.login(BOT_TOKEN).then(() => {
    loadEvents(client);
    loadCommands(client);
});
