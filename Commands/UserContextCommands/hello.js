const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new ContextMenuCommandBuilder().setName('Say Hello').setType(ApplicationCommandType.User),

	async execute(interaction) {
		const targetUser = interaction.targetUser

		await interaction.reply({
			content: `${targetUser} 👋 hello!`,
		})
	},
}
