const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js')
const logData = require('../../data/logData')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setuplogs')
		.setDescription('Set up the logs channel')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.addChannelOption(option =>
			option
				.setName('channel')
				.setDescription('The channel to set up the logs channel')
				.setRequired(false)
		),

	async execute(interaction) {
		const { channel, guildId, options } = interaction
		const logChannel = options.getChannel('channel') || channel
		try {
			await logData.setupLogChannel(guildId, logChannel.id, interaction)
		} catch {
			return interaction.reply({
				content: 'Sorry, something went wrong setting up your log channel',
				ephemeral: true,
			})
		}
	},
}
