const mongoCollections = require('../../config/mongoCollections')
const { themes, logs } = mongoCollections

let exportedMethods = {
	async updateGuild(guildId, guildName) {
		const themesCollection = await themes()
		const logsCollection = await logs()
		await themesCollection.updateMany({ guildId: guildId }, { $set: { guildName: guildName } })
		await logsCollection.updateOne({ guildId: guildId }, { $set: { guildName: guildName } })
	},
}

module.exports = exportedMethods
