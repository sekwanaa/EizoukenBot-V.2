const mongoCollections = require('../config/mongoCollections')
const logs = mongoCollections.logs

let exportedMethods = {
	async getChannel(guildId, type) {
		const logCollection = await logs()
		const guild = await logCollection.findOne({ guildId: guildId, type: type })
		return guild.channelId
	},
	async checkIfExist(guildId, type) {
		const logCollection = await logs()
		const exists = await logCollection.findOne({ guildId: guildId, type: type })
		let result
		exists ? (result = true) : (result = false)
		return result
	},
	async setupLogChannel(guildId, guildName, channelId, type, interaction) {
		const logCollection = await logs()
		const exists = await this.checkIfExist(guildId)
		if (!exists) {
			await logCollection.insertOne({
				guildName,
				guildId,
				channelId,
				type,
			})
			return interaction.reply({
				content: `Successfully setup ${type} log channel`,
				ephemeral: true,
			})
		}

		await logCollection.deleteOne({ guildId: guildId, type: type })
		await logCollection.insertOne({
			guildName,
			guildId,
			channelId,
			type,
		})
		return interaction.reply({
			content: 'Successfully replaced old log channel',
			ephemeral: true,
		})
	},
}

module.exports = exportedMethods
