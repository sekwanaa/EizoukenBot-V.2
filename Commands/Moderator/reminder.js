const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reminder')
		.setDescription('Complete reminder command')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents)
		.addSubcommand(subcommand =>
			subcommand
				.setName('create')
				.setDescription('Create a reminder')
				.addStringOption(option =>
					option.setName('title').setDescription('Set the reminder title').setRequired(true)
				)
				.addStringOption(option =>
					option
						.setName('description')
						.setDescription('Set the reminder description')
						.setRequired(true)
				)
				.addIntegerOption(option =>
					option.setName('hour').setDescription('Set the reminder hour. 0-23').setRequired(true)
				)
				.addIntegerOption(option =>
					option.setName('minute').setDescription('Set the reminder minute. 0-60').setRequired(true)
				)
				.addIntegerOption(option =>
					option.setName('day').setDescription('Set the reminder day. 0-31').setRequired(false)
				)
				.addIntegerOption(option =>
					option.setName('month').setDescription('Set the reminder month. 0-12').setRequired(false)
				)
				.addIntegerOption(option =>
					option.setName('year').setDescription('Set the reminder year').setRequired(false)
				)
		)
		.addSubcommand(subcommand =>
			subcommand.setName('list').setDescription('view a list of all reminders')
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('update')
				.setDescription('Update a reminder')
				.addIntegerOption(option =>
					option.setName('id').setDescription('Select a reminder ID').setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand.setName('purge').setDescription('Purge all reminders that have been fulfilled')
		),

	async execute(interaction) {
		const { options } = interaction
		const subcommands = options.getSubcommand()
		const title = options.getString('title')
		const description = options.getString('description')
		const year = options.getInteger('year') || new Date().getFullYear()
		const month = options.getInteger('month') || new Date().getMonth()
		const dayOfMonth = options.getInteger('day') || new Date().getDate()
		const hour = options.getInteger('hour')
		const minute = options.getInteger('minute')
		const date = new Date(year, month, dayOfMonth).toLocaleDateString()

		const mongoCollections = require('../../config/mongoCollections.js')
		const reminders = mongoCollections.reminders
		const remindersCollections = await reminders()

		switch (subcommands) {
			case 'create':
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

					//TODO need to be able to reload the scheduled reminder for the discord bot

					return interaction.reply({
						content: `Your reminder has been successfully created`,
						ephemeral: true,
					})
				} catch (e) {
					console.log(e)
					return interaction.reply({
						content: `There was an issue creating your reminder. Please try again later.`,
						ephemeral: true,
					})
				}
			case 'list':
				try {
					const reminders = await remindersCollections.find({}).toArray()

					if (reminders.length == 0) {
						const errorEmbed = new EmbedBuilder()
							.setDescription('Sorry, there are no reminders.')
							.setColor('Red')

						return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
					}

					let message = ''

					reminders.forEach(
						(reminder, index) =>
							(message += `**ID: ${index}**\`\`\`\nTitle: ${reminder.title}\nDescription: ${reminder.description}\n\Year: ${reminder.year}\nMonth: ${reminder.month}\nDay: ${reminder.day}\nHour: ${reminder.hour}\nMinute: ${reminder.minute}\`\`\`\n`)
					)

					const embed = new EmbedBuilder().setDescription(message)

					return interaction.reply({ embeds: [embed], ephemeral: true })
				} catch (e) {
					console.log(e)
					return interaction.reply({
						content: `Sorry, there was an issue fetching reminders from the datebase, please try again later`,
						ephemeral: true,
					})
				}
			case 'update':
				break
			case 'purge':
				try {
					const currentDate = new Date().toLocaleDateString()

					const reminders = await remindersCollections
						.find({ date: { $lte: currentDate } })
						.toArray()

					await remindersCollections.deleteMany({ date: { $lte: currentDate } })

					return interaction.reply({
						content: `Successfully purged ${reminders.length} reminders`,
						ephemeral: true,
					})
				} catch (e) {
					console.log(e)
					return interaction.reply({
						content: 'There was an error purging reminders before today.',
						ephemeral: true,
					})
				}
		}
	},
}
