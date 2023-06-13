const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js')
const logData = require('../../data/logData')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setup-logs')
		.setDescription('Set up the logs channel')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.addSubcommand(subcommand =>
			subcommand
				.setName('text')
				.setDescription('Set up the text message logging channel')
				.addChannelOption(option =>
					option
						.setName('channel')
						.setDescription('The channel to set up the text message logging channel')
						.setRequired(false)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('voice')
				.setDescription('Set up the vocie activity logging channel')
				.addChannelOption(option =>
					option
						.setName('channel')
						.setDescription('The channel to set up the text message logging channel')
						.setRequired(false)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('guild-event')
				.setDescription('Set up the vocie activity logging channel')
				.addChannelOption(option =>
					option
						.setName('channel')
						.setDescription('The channel to set up the text message logging channel')
						.setRequired(false)
				)
		),

	async execute(interaction) {
		const { channel, guildId, member, options } = interaction
		const subcommand = options.getSubcommand()
		let type = ''

		switch (subcommand) {
			case 'text':
				const textLogChannel = options.getChannel('channel') || channel
				type = 'text'
				try {
					await logData.setupLogChannel(
						guildId,
						member.guild.name,
						textLogChannel.id,
						type,
						interaction
					)
				} catch {
					return interaction.reply({
						content: 'Sorry, something went wrong setting up your log channel',
						ephemeral: true,
					})
				}
				break
			case 'voice':
				const voiceLogChannel = options.getChannel('channel') || channel
				type = 'voice'
				try {
					await logData.setupLogChannel(
						guildId,
						member.guild.name,
						voiceLogChannel.id,
						type,
						interaction
					)
				} catch {
					return interaction.reply({
						content: 'Sorry, something went wrong setting up your log channel',
						ephemeral: true,
					})
				}
				break
			case 'guild-event':
				const guildEventLogChannel = options.getChannel('channel') || channel
				type = 'guildEvent'
				try {
					await logData.setupLogChannel(
						guildId,
						member.guild.name,
						guildEventLogChannel.id,
						type,
						interaction
					)
				} catch {
					return interaction.reply({
						content: 'Sorry, something went wrong setting up your log channel',
						ephemeral: true,
					})
				}
				break
		}
		// const logChannel = options.getChannel('channel') || channel
		// try {
		// 	await logData.setupLogChannel(guildId, member.guild.name, logChannel.id, interaction)
		// } catch {
		// 	return interaction.reply({
		// 		content: 'Sorry, something went wrong setting up your log channel',
		// 		ephemeral: true,
		// 	})
		// }
	},
}
