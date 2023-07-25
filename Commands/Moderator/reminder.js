const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js')
const reminderData = require('../../data/reminderData.js')
let schedule = require('node-schedule')

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
				.addChannelOption(option =>
					option
						.setName('channel')
						.setDescription('Channel to send notification to')
						.setRequired(false)
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

	async execute(interaction, client) {
		const { options, guildId } = interaction
		const subcommands = options.getSubcommand()
		const title = options.getString('title')
		const description = options.getString('description')
		const year = options.getInteger('year') || new Date().getFullYear()
		const month = options.getInteger('month') || new Date().getMonth()
		const dayOfMonth = options.getInteger('day') || new Date().getDate()
		const hour = options.getInteger('hour')
		const minute = options.getInteger('minute')
		const date = new Date(year, month, dayOfMonth).toLocaleDateString()

		const channel = options.getChannel('channel') || interaction.channel.id

		switch (subcommands) {
			case 'create':
				let scheduledReminder = new schedule.RecurrenceRule()
				scheduledReminder.year = year
				scheduledReminder.month = month
				scheduledReminder.date = dayOfMonth
				scheduledReminder.hour = hour
				scheduledReminder.minute = minute

				const job = schedule.scheduleJob(scheduledReminder, function () {
					reminderData.scheduledMessage(title, description, channel, client)
				})

				const createWarning = await reminderData.createReminder(
					guildId,
					channel,
					title,
					description,
					date,
					year,
					month,
					dayOfMonth,
					hour,
					minute
				)

				if (createWarning !== 'success') {
					return interaction.reply({
						content: `There was an issue creating your reminder. Please try again later.`,
						ephemeral: true,
					})
				}

				return interaction.reply({
					content: `Your reminder has been successfully created`,
					ephemeral: true,
				})
			case 'list':
				const reminders = await reminderData.getReminders()

				if (reminders.remindersArr.length == 0) {
					const errorEmbed = new EmbedBuilder()
						.setDescription('Sorry, there are no reminders.')
						.setColor('Red')

					return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
				}

				//TODO check if the reminder is for the correct guild to display
				//* either check here or in the reminderData.js

				const embed = new EmbedBuilder()
					.setTitle('Reminder List')
					.setDescription(reminders.message)
					.setColor('Random')

				return interaction.reply({ embeds: [embed], ephemeral: true })
			case 'update':
				//TODO update reminders based on case id.
				break
			case 'purge':
				//TODO maybe make purging reminders automated
				const purgeReminders = await reminderData.purgeReminders()

				if (purgeReminders == 'error') {
					return interaction.reply({
						content: 'There was an error purging reminders before today.',
						ephemeral: true,
					})
				}

				if (purgeReminders.length == 0) {
					return interaction.reply({
						content: `There are no reminders to purge`,
						ephemeral: true,
					})
				}

				return interaction.reply({
					content: `Successfully purged ${purgeReminders.length} reminders`,
					ephemeral: true,
				})
		}
	},
}