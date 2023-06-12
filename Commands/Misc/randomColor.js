const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('random-color')
		.setDescription('Generates a random hex color with a preview'),

	async execute(interaction) {
		const color = `#${(Math.random().toString(16) + '000000').substring(2, 8)}`
		const embed = new EmbedBuilder().setDescription(color).setColor(color)
		await interaction.reply({ embeds: [embed], ephemeral: true })
	},
}
