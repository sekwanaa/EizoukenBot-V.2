const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const themesData = require('../../data/themesData')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add-theme')
		.setDescription('Allows user to add/change a theme for a month')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.addStringOption(option =>
			option
				.setName('month')
				.setDescription('Choose a month to add/update a theme for')
				.setChoices(
					{ name: 'January', value: 'january' },
					{ name: 'February', value: 'february' },
					{ name: 'March', value: 'march' },
					{ name: 'April', value: 'april' },
					{ name: 'May', value: 'may' },
					{ name: 'June', value: 'june' },
					{ name: 'July', value: 'july' },
					{ name: 'August', value: 'august' },
					{ name: 'September', value: 'september' },
					{ name: 'October', value: 'october' },
					{ name: 'November', value: 'november' },
					{ name: 'December', value: 'december' }
				)
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
		const year = options.getInteger('year') || new Date().getFullYear()
		const action = await themesData.addThemeData(guildName, guildId, month, year, theme)
		interaction.reply({ content: `${action}` })
	},
}
