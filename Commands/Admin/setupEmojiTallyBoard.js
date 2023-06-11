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

		const exists = await tallyBoardData.getTallyBoard(guildId)

		if (exists !== null) {
			return interaction
				.reply({
					content: `Your emoji tally board channel has been updated to #${channelChoice.name}`,
					ephemeral: true,
				})
				.then(tallyBoardData.updateTallyBoard(guildId, channelChoice.id))
				.catch(error => {
					console.log(error)
					interaction.reply({ content: `There was something that went wrong` })
				})
		}

		return interaction
			.reply({
				content: `Your emoji tally board has been setup in #${channelChoice.name}`,
				ephemeral: true,
			})
			.then(tallyBoardData.addTallyBoard(guildId, channelChoice.id))
			.catch(error => {
				console.log(error)
				interaction.reply({ content: `There was something that went wrong` })
			})
	},
}
