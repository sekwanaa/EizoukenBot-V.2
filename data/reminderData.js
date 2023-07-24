const mongoCollections = require('../config/mongoCollections')

let exportedMethods = {
	async getReminders() {
		const reminders = mongoCollections.reminders
		const remindersCollections = await reminders()

		const remindersArr = await remindersCollections.find({}).toArray()
		let message = ''

		remindersArr.forEach(
			(reminder, index) =>
				(message += `**ID: ${index}**\`\`\`\n\
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
	async createReminder(title, description, date, year, month, dayOfMonth, hour, minute) {
		const reminders = mongoCollections.reminders
		const remindersCollections = await reminders()

		try {
			let reminderObj = {
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
	async updateWarnings() {
		const reminders = mongoCollections.reminders
		const remindersCollections = await reminders()
	},
}

module.exports = exportedMethods
