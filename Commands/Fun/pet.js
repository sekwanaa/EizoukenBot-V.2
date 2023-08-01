const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pet')
		.setDescription('Spread some love, pet someone')
		.addRoleOption(option => option.setName('target').setDescription('Who would you like to pet?')),

	async execute(interaction) {
		const { options } = interaction
		const target = options.getRole('target')

		const embed = new EmbedBuilder().setDescription(`${target} UwU you make my heart go nyan~~`)

		interaction.reply({ embeds: [embed] })
	},
}