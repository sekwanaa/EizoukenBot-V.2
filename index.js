require('dotenv').config();

const { BOT_TOKEN } = process.env;

const { Client, GatewayIntentBits } = require(`discord.js`);
const schedule = require("node-schedule");

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
});

client.on("ready", () => {
  console.log("We're ready to rumble!");
  client.user.setActivity(`| ${prefix}help |`);
});

// START Scheduled Themes announcement

// let scheduledAnnouncement = new schedule.RecurrenceRule();
// scheduledAnnouncement.date = [1, 28];
// scheduledAnnouncement.hour = 8;
// scheduledAnnouncement.minute = 0;

// const job = schedule.scheduleJob(scheduledAnnouncement, function(){themesFunctions.scheduled(client)});

// END Scheduled themes announcement

  // START Message Response

// client.on("messageCreate", async (msg) => {
//   var args
//   var command
//   var arguments
  
//   const allowedUsers = msg.guild.roles.cache.find(r => r.name === "Pengu Troopers");

//   // START command handler
//   args = msg.content.slice(prefix.length).split(/ +/);
//   command = args[0];
  
//   if (args.length > 1) {
//     arguments = args.slice(1, args.length);
//   }

//   // END command handler

//   if (msg.content.startsWith(`${prefix}`) && !msg.author.bot) {

//     const messageAction = await messageCreateHandler.messageCreate(msg, prefix, command, args, arguments, allowedUsers);

//   } 

//   // START bot msg self deletion

//   else if (msg.author.bot) {
    
//     const botMsgDelete = await botMsgDeleteHandler.botSelfMsgDelete(msg, command);

//   } 

//   // END bot msg self deletion

//   else {
//     return;
//   }

// });

  // END Message Response

client.login(BOT_TOKEN);
