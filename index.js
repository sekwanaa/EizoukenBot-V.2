require('dotenv').config()
const { BOT_TOKEN } = process.env
const {
	Client,
	GatewayIntentBits,
	User,
	Message,
	GuildMember,
	ThreadMember,
	Collection,
	Partials,
} = require(`discord.js`)
const logs = require('discord-logs')
const { DisTube } = require('distube')
const { SpotifyPlugin } = require('@distube/spotify')
const schedule = require('node-schedule')
const scheduleMessageCommand = require('./tools/Automation/scheduledMessage')
const autoProfilePicChangeCommand = require('./tools/Automation/autoProfilePicChange')
const { loadEvents } = require('./Handlers/eventHandler')
const { loadCommands } = require('./Handlers/commandHandler')
const { handleLogs } = require('./Handlers/logHandler')
const prefix = '?'

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
	partials: [
		User,
		Partials.Message,
		GuildMember,
		ThreadMember,
		Partials.Channel,
		Partials.Reaction,
	],
})

client.distube = new DisTube(client, {
	emitNewSongOnly: true,
	leaveOnFinish: true,
	emitAddSongWhenCreatingQueue: false,
	plugins: [new SpotifyPlugin()],
})

client.commands = new Collection()
client.cooldowns = new Collection()

logs(client, {
	debug: true,
})

module.exports = client

// start Scheduled message

let scheduledAnnouncement = new schedule.RecurrenceRule()
scheduledAnnouncement.date = [1, 28]
scheduledAnnouncement.hour = 8
scheduledAnnouncement.minute = 0

const job = schedule.scheduleJob(scheduledAnnouncement, function () {
	scheduleMessageCommand.scheduledMessage(client)
})

// end scheduled message

// start auto profile pic change

let autoProfilePicChange = new schedule.RecurrenceRule()
autoProfilePicChange.date = 1
autoProfilePicChange.hour = 8
autoProfilePicChange.minute = 0
// autoProfilePicChange.second = [0]

const job2 = schedule.scheduleJob(autoProfilePicChange, function () {
	autoProfilePicChangeCommand.autoProfilePicChange(client)
})

// end auto profile pic change

client.login(BOT_TOKEN).then(() => {
	loadEvents(client)
	loadCommands(client)
	handleLogs(client)
})
