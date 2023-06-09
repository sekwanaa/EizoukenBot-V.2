const mongoCollections = require('../config/mongoCollections')
const logs = mongoCollections.logs

let exportedMethods = {
	async getChannel(guildId) {
		const logCollection = await logs()
		const guild = await logCollection.findOne({ guildId: guildId })
		return guild.channelId
	},
	async checkIfExist(guildId) {
		const logCollection = await logs()
		const exists = await logCollection.findOne({ guildId: guildId })
		let result
		exists ? (result = true) : (result = false)
		return result
	},
	async setupLogChannel(guildId, guildName, channelId, interaction) {
		const logCollection = await logs()
		const exists = await this.checkIfExist(guildId)
		if (!exists) {
			await logCollection.insertOne({
				guildName,
				guildId,
				channelId,
			})
			return interaction.reply({ content: 'Successfully setup log channel', ephemeral: true })
		} else {
			await logCollection.deleteOne({ guildId: guildId })
			await logCollection.insertOne({
				guildName,
				guildId,
				channelId,
			})
			return interaction.reply({
				content: 'Successfully replaced old log channel',
				ephemeral: true,
			})
		}
	},
}

module.exports = exportedMethods
