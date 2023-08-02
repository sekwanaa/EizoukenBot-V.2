const mongoCollections = require('../config/mongoCollections')
const { EmbedBuilder } = require('discord.js')

let exportedMethods = {
	async getReminders(guildId) {
		const reminders = mongoCollections.reminders
		const remindersCollections = await reminders()

		const remindersArr = await remindersCollections.find({ guildId: guildId }).toArray()
		if (remindersArr.length == 0) return null

		let message = ''

		remindersArr.forEach(
			reminder =>
				(message += `**ID: ${reminder.caseId}**\`\`\`\n\
Title: ${reminder.title}\n\
Description: ${reminder.description}\n\
Year: ${reminder.year}\n\
Month: ${reminder.month}\n\
Day: ${reminder.day}\n\
Hour: ${reminder.hour}\n\
Minute: ${reminder.minute}\`\`\`\n`)
		)
		return { remindersArr: remindersArr, message: message }
	},
	async createReminder(
		guildId,
		channel,
		caseId,
		title,
		description,
		date,
		year,
		month,
		dayOfMonth,
		hour,
		minute
	) {
		const reminders = mongoCollections.reminders
		const remindersCollections = await reminders()

		try {
			let reminderObj = {
				guildId: guildId,
				channel: channel,
				caseId: caseId,
				title: title,
				description: description,
				date: date,
				year: year,
				month: month,
				day: dayOfMonth,
				hour: hour,
				minute: minute,
			}
			await remindersCollections.insertOne(reminderObj)

			return 'success'
		} catch (e) {
			console.log(e)
			return 'error'
		}
	},
	async purgeReminders() {
		const reminders = mongoCollections.reminders
		const remindersCollections = await reminders()

		try {
			const currentDate = new Date().toLocaleDateString()

			const purgeCount = remindersCollections.find({ date: { $lt: currentDate } }).toArray()

			await remindersCollections.deleteMany({ date: { $lt: currentDate } })

			return purgeCount
		} catch (e) {
			console.log(e)
			return 'error'
		}
	},
	async updateReminders(guildId, caseId, title, description) {
		const reminders = mongoCollections.reminders
		const remindersCollections = await reminders()

		if (!(title && description)) {
			if (title) {
				remindersCollections.findOneAndUpdate(
					{ guildId: guildId, caseId: caseId },
					{ $set: { title: title } }
				)

				return 'Title has been updated successfully'
			} else if (description) {
				remindersCollections.findOneAndUpdate(
					{ guildId: guildId, caseId: caseId },
					{ $set: { description: description } }
				)

				return 'Description has been updated successfully'
			} else {
				return 'Please include either a title or description to update'
			}
		} else {
			remindersCollections.findOneAndUpdate(
				{ guildId: guildId, caseId: caseId },
				{ $set: { title: title, description: description } }
			)

			return 'Title and description have been updated successfully'
		}
	},
	async scheduledMessage(title, message, channel, client) {
		const msgChannel = client.channels.cache.get(channel)
		const reminderEmbed = new EmbedBuilder()
			.setTitle(title)
			.setDescription(message)
			.setColor('Aqua')
		return msgChannel.send({ embeds: [reminderEmbed] })
	},
}

module.exports = exportedMethods
