const mongoCollections = require('../config/mongoCollections')
const moderators = mongoCollections.moderators

let exportedMethods = {
	async addModerator(guildId, roleId) {
		const moderatorsCollection = await moderators()
		const moderatorObj = {
			guildId,
			roleId,
		}
		await moderatorsCollection.insertOne(moderatorObj)
	},

	async removeModerator(guildId, roleId) {
		const moderatorsCollection = await moderators()
		try {
			const deleted = await moderatorsCollection.deleteOne({ guildId: guildId, roleId: roleId })
			return deleted.deletedCount
		} catch (err) {
			console.log(err)
		}
	},

	async getModerators(guildId) {
		const moderatorsCollection = await moderators()
		return await moderatorsCollection.find({ guildId: guildId }).toArray()
	},

	async updateModerators(guildId, newCaseId) {
		const moderatorsCollection = await moderators()
		try {
			const currentModerators = await this.getModerators(guildId)
			const updatedModerators = currentModerators.map((moderator, index) => {
				return {
					...moderator,
					caseId: newCaseId,
				}
			})
			await moderatorsCollection.deleteMany({ guildId: guildId })
			await moderatorsCollection.insertMany(updatedModerators)
		} catch (err) {
			console.log(err)
		}
	},
}

module.exports = exportedMethods
