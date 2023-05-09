require("dotenv").config();

const { BOT_TOKEN } = process.env;

const {
  Client,
  GatewayIntentBits,
  User,
  Message,
  GuildMember,
  ThreadMember,
  Collection,
} = require(`discord.js`);

const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const { loadEvents } = require("./Handlers/eventHandler");
const { loadCommands } = require("./Handlers/commandHandler");

const prefix = "?";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [User, Message, GuildMember, ThreadMember],
});

client.distube = new DisTube(client, {
  emitNewSongOnly: true,
  leaveOnFinish: true,
  emitAddSongWhenCreatingQueue: false,
  plugins: [new SpotifyPlugin()],
});

client.commands = new Collection();

module.exports = client;

// start Scheduled message

const schedule = require("node-schedule");
const scheduleMessageCommand = require("./tools/Admins/scheduledMessage");

let scheduledAnnouncement = new schedule.RecurrenceRule();
scheduledAnnouncement.date = [1, 28];
scheduledAnnouncement.hour = 8;
scheduledAnnouncement.minute = 0;

const job = schedule.scheduleJob(scheduledAnnouncement, function () {
  scheduleMessageCommand.scheduledMessage(client);
});

// end scheduled message

client.login(BOT_TOKEN).then(() => {
  loadEvents(client);
  loadCommands(client);
});
