const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js')
const tallyBoardData = require('../../data/tallyBoardData')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setup-emoji-tally-board')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.setDescription('Setup the emopji tally board')
		.addChannelOption(option =>
			option.setName('channel').setDescription('Channel of emoji tally board').setRequired(false)
		),

	async execute(interaction) {
		const { options, guildId, channel } = interaction
		const channelChoice = options.getChannel('channel') || channel
		const tallyEmbed = new EmbedBuilder().setTitle(`Emoji Tally Board`)

		const exists = await tallyBoardData.getTallyBoard(guildId)

		if (exists) {
			try {
				await tallyBoardData.updateTallyBoard(guildId, channelChoice.id)
				await channelChoice.send({ embeds: [tallyEmbed] })
				return interaction.reply({
					content: `Your emoji tally board channel has been updated to #${channelChoice.name}`,
					ephemeral: true,
				})
			} catch (error) {
				return interaction.reply({
					content: `There was an error while setting up your emoji tally board`,
					ephemeral: true,
				})
			}
		}

		try {
			await tallyBoardData.addTallyBoard(guildId, channelChoice.id)
		} catch (error) {
			return interaction.reply({
				content: `There was an error while setting up your emoji tally board`,
				ephemeral: true,
			})
		}

		await channelChoice.send({ embeds: [tallyEmbed] })
		return interaction.reply({
			content: `Your emoji tally board has been setup in #${channelChoice.name}`,
			ephemeral: true,
		})
	},
}
