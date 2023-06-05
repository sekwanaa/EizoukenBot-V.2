const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Get the avatar of yourself or another user')
		.addUserOption(option =>
			option
				.setName('user')
				.setDescription('The user you want to get the avatar of')
				.setRequired(false)
		),

	async execute(interaction) {
		const { options } = interaction
		const user = options.getUser('user') || interaction.user
		const embed = new EmbedBuilder().setImage(user.displayAvatarURL({ dynamic: true }))
		await interaction.reply({ embeds: [embed] })
	},
}
