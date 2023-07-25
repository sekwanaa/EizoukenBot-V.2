const mongoCollections = require('../config/mongoCollections')
const reminders = mongoCollections.reminders
const schedule = require('node-schedule')
const reminderData = require('../data/reminderData')

async function loadReminders(client) {
	console.log(client)
	const remindersCollections = await reminders()
	const currentDay = new Date().toLocaleDateString()

	try {
		const scheduledReminders = await remindersCollections
			.find({ date: { $gte: currentDay } })
			.toArray()

		for (const reminder of scheduledReminders) {
			const { guildId, title, description, year, month, channel, day, hour, minute } = reminder

			const msgChannel = client.channels.cache.get(channel)

			if (msgChannel.guildId !== guildId) continue

			let scheduledReminder = new schedule.RecurrenceRule()
			scheduledReminder.year = year
			scheduledReminder.month = month
			scheduledReminder.date = day
			scheduledReminder.hour = hour
			scheduledReminder.minute = minute

			const job = schedule.scheduleJob(scheduledReminder, function () {
				reminderData.scheduledMessage(title, description, msgChannel, client)
			})
		}

		return console.log('Loaded Reminders')
	} catch (error) {
		console.log(error)
	}
}

module.exports = { loadReminders }
