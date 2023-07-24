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
		const year = options.getInteger('year')
		const month = options.getInteger('month')
		const day = options.getInteger('day')
		const hour = options.getInteger('hour')
		const minute = options.getInteger('minute')

		const mongoCollections = require('../../config/mongoCollections.js')
		const reminders = mongoCollections.reminders
		const remindersCollections = await reminders()

		switch (subcommands) {
			case 'create':
				try {
					let reminderObj = {
						title: title,
						description: description,
						year: year || new Date().getFullYear(),
						month: month || new Date().getMonth(),
						day: day || new Date().getDay(),
						hour: hour,
						minute: minute,
					}
					await remindersCollections.insertOne(reminderObj)

					return interaction.reply({
						content: `Your reminder has been successfully created`,
						ephemeral: true,
					})
				} catch (e) {
					console.log(e)
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
				}
		}
	},
}
