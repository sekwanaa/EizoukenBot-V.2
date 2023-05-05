require('dotenv').config();

const { BOT_TOKEN } = process.env;

const { Client, GatewayIntentBits, User, Message, GuildMember, ThreadMember, Collection } = require(`discord.js`);

const prefix = "?";

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

const schedule = require("node-schedule")
const scheduleMessageCommand = require("./Commands/Admins/scheduledMessage")

let scheduledAnnouncement = new schedule.RecurrenceRule();
scheduledAnnouncement.date = [1, 28];
scheduledAnnouncement.hour = 8;
scheduledAnnouncement.minute = 0;
// scheduledAnnouncement.second = [0, 30];

const job = schedule.scheduleJob(scheduledAnnouncement, function(){scheduleMessageCommand.scheduledMessage(client)});

client.commands = new Collection()

const { loadEvents } = require("./Handlers/eventHandler");
const { loadCommands } = require("./Handlers/commandHandler");

client.login(BOT_TOKEN).then(() => {
    loadEvents(client);
    loadCommands(client);
});
