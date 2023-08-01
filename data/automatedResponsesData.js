const mongoCollections = require('../config/mongoCollections')
const responses = mongoCollections.automated_responses

let exportedMethods = {
	async getResponses() {
		const responsesCollection = await responses()

		const messages = responsesCollection.find({}).toArray()
		return messages
	},
}

module.exports = exportedMethods
