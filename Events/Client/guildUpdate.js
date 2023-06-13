const mongoCollections = require('../../config/mongoCollections')
const { themes, logs } = mongoCollections

module.exports = {
	name: 'guildUpdate',
	once: false,
	async execute(oldGuild, client) {
		const themesCollection = await themes()
		const logsCollection = await logs()
		await themesCollection.updateMany({ guildId: client.id }, { $set: { guildName: client.name } })
		await logsCollection.updateMany({ guildId: client.id }, { $set: { guildName: client.name } })
	},
}
