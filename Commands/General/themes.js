const { SlashCommandBuilder } = require('discord.js')
const themesData = require('../../data/themesData')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('themes')
		.setDescription('Allows user to see the current themes of the year')
		.addIntegerOption(option =>
			option.setName('year').setDescription('Choose a year to see themes from').setRequired(false)
		),

	async execute(interaction) {
		const { guild, options } = interaction
		const year = options.getInteger('year') || new Date().getFullYear()
		const guildId = guild.id
		const message = await themesData.themes(guildId, year)
		interaction.reply({ embeds: [message] })
	},
}
