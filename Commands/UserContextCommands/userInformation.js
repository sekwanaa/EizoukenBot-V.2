const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('User Information')
		.setType(ApplicationCommandType.User),

	async execute(interaction) {
		const targetUser = interaction.targetUser

		const embed = new EmbedBuilder()
			.setImage(targetUser.displayAvatarURL({ dynamic: true }))
			.addFields(
				{ name: 'Username', value: targetUser.username },
				{ name: 'User Id', value: targetUser.id }
			)
		await interaction.reply({ embeds: [embed], ephemeral: true })
	},
}
