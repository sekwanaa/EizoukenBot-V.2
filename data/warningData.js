const mongoCollections = require('../config/mongoCollections')
const warnings = mongoCollections.warnings

let exportedMethods = {
	async getWarnings(guildId, userID) {
		const warningsCollection = await warnings()
		return await warningsCollection.find({ guildId: guildId, userID: userID }).toArray()
	},
	async addWarning(guildId, caseID, user, reason, executor, warnDate) {
		const warningsCollection = await warnings()
		const warningObj = {
			guildId,
			caseID,
			user: user.tag,
			userID: user.id,
			reason,
			executor,
			warnDate,
		}
		await warningsCollection.insertOne(warningObj)
	},
	async removeWarning(guildId, caseID, userID) {
		const warningsCollection = await warnings()
		try {
			await warningsCollection.deleteOne({ guildId: guildId, caseID: caseID, userID: userID })
		} catch (err) {
			console.log(err)
		}
	},
	async clearWarnings(guildId, userID) {
		const warningsCollection = await warnings()
		try {
			await warningsCollection.deleteMany({ guildId: guildId, userID: userID })
		} catch (err) {
			console.log(err)
		}
	},
	async updateWarnings(guildId, userID) {
		const warningsCollection = await warnings()
		try {
			const currentWarnings = await this.getWarnings(guildId, userID)
			const updatedWarnings = currentWarnings.map((warning, index) => {
				return {
					...warning,
					caseID: index,
				}
			})
			await warningsCollection.deleteMany({ guildId: guildId, userID: userID })
			await warningsCollection.insertMany(updatedWarnings)
		} catch (err) {
			console.log(err)
		}
	},
}

module.exports = exportedMethods
