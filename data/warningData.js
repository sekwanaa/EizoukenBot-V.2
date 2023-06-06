const mongoCollections = require('../config/mongoCollections')
const warnings = mongoCollections.warnings

let exportedMethods = {
	async getWarnings(userID) {
		const warningsCollection = await warnings()
		return await warningsCollection.find({ userID: userID }).toArray()
	},
	async addWarning(user, reason, executor, warnDate) {
		const warningsCollection = await warnings()
		const warningObj = {
			user: user.tag,
			userID: user.id,
			reason,
			executor,
			warnDate,
		}
		await warningsCollection.insertOne(warningObj)
	},
	async removeWarning(caseID, userID) {
		const warningsCollection = await warnings()
		try {
			await warningsCollection.deleteOne({ caseID: caseID, userID: userID })
		} catch (err) {
			console.log(err)
		}
	},
	async clearWarnings(userID) {
		const warningsCollection = await warnings()
		try {
			await warningsCollection.deleteMany({ userID: userID })
		} catch (err) {
			console.log(err)
		}
	},
}

module.exports = exportedMethods
