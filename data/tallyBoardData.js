const mongoCollections = require('../config/mongoCollections')
const tallyBoard = mongoCollections.tallyBoard

let exportedMethods = {
	async getTallyBoard(guildId) {
		const tallyBoardCollection = await tallyBoard()
		const guildTallyBoard = await tallyBoardCollection.findOne({ guildId: guildId })
		let result = null
		guildTallyBoard ? (result = guildTallyBoard) : (result = null)
		return result
	},
	async addTallyBoard(guildId, channelId) {
		const tallyBoardCollection = await tallyBoard()
		await tallyBoardCollection.insertOne({
			guildId: guildId,
			channelId: channelId,
		})
	},
	async updateTallyBoard(guildId, channelId) {
		const tallyBoardCollection = await tallyBoard()
		await tallyBoardCollection.updateOne({ guildId: guildId }, { $set: { channelId: channelId } })
	},
}

module.exports = exportedMethods
