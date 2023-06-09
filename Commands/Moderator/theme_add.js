const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const themesData = require('../../data/themesData')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add_theme')
		.setDescription('Allows user to add/change a theme for a month')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.addStringOption(option =>
			option
				.setName('month')
				.setDescription('Choose a month to add/update a theme for')
				.setRequired(true)
		)
		.addStringOption(option =>
			option.setName('theme').setDescription('Input a theme for the month').setRequired(true)
		)
		.addIntegerOption(option =>
			option.setName('year').setDescription('Choose a year to add the theme to').setRequired(false)
		),

	async execute(interaction) {
		const { guild, options } = interaction
		const guildName = guild.name
		const guildId = guild.id
		const month = options.getString('month')
		const theme = options.getString('theme')
		const year = options.getInteger('year')
		if (year) {
			const action = await themesData.addThemeData(guildName, guildId, month, year, theme)
			interaction.reply({ content: `${action}` })
		} else {
			const year = new Date().getFullYear()
			const action = await themesData.addThemeData(guildName, guildId, month, year, theme)
			interaction.reply({ content: `${action}` })
		}
	},
}
