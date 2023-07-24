const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js')
const reminderData = require('../../data/reminderData.js')

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

		switch (subcommands) {
			case 'create':
				const createWarning = await reminderData.createReminder(
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
				//TODO need to be able to reload the scheduled reminder for the discord bot

				return interaction.reply({
					content: `Your reminder has been successfully created`,
					ephemeral: true,
				})
			case 'list':
				try {
					const reminders = await reminderData.getReminders()

					if (reminders.remindersArr.length == 0) {
						const errorEmbed = new EmbedBuilder()
							.setDescription('Sorry, there are no reminders.')
							.setColor('Red')

						return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
					}

					const embed = new EmbedBuilder()
						.setTitle('Reminder List')
						.setDescription(reminders.message)
						.setColor('Random')

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
