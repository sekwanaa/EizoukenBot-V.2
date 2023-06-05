const mongoCollections = require('../config/mongoCollections')
const { EmbedBuilder } = require('discord.js')
const themes = mongoCollections.themes
let months = [
	'january',
	'february',
	'march',
	'april',
	'may',
	'june',
	'july',
	'august',
	'september',
	'october',
	'november',
	'december',
]

async function capitalize(string) {
	return string[0].toUpperCase() + string.slice(1)
}

let exportedMethods = {
	async getThemes(year, month) {
		const themesCollection = await themes()
		const themeObj = await themesCollection.findOne({ year: year, month: month })
		return themeObj.theme
	},
	async themes(year) {
		const themesCollection = await themes()
		let message = ``

		for (i = 0; i < months.length; i++) {
			const currentThemes = await themesCollection.findOne({ year: year, month: months[i] })
			if (currentThemes != null) {
				let month = await capitalize(currentThemes.month)
				message += `\n\t ${month}: ${currentThemes.theme}`
			}
		}

		const embed = new EmbedBuilder()
			.setTitle(`Themes for ${year}`)
			.setDescription(`${message}`)
			.setColor('Gold')

		return embed
	},
	async addThemeData(month, year, theme) {
		const themesCollection = await themes()
		const currentThemes = await themesCollection.findOne({ year: year, month: month })
		if (currentThemes != null) {
			try {
				await themesCollection.findOneAndUpdate(
					{ year: year, month: month },
					{ $set: { theme: theme } }
				)
				if (currentThemes.theme == '') {
					return `You have updated the theme for ${month} ${year} to ${theme}`
				} else {
					return `You have updated the theme for ${month} ${year} from ${currentThemes.theme} to ${theme}`
				}
			} catch (error) {
				return error
			}
		} else {
			try {
				let newTheme = {
					year: year,
					month: month,
					theme: theme,
				}

				const add_theme = await themesCollection.insertOne(newTheme)
				return `Theme: '${theme}' has been added to the month ${month} in ${year}`
			} catch (error) {
				return error
			}
		}
	},
	async removeThemeData(month, year) {
		try {
			const themesCollection = await themes()
			const removeTheme = await themesCollection.findOneAndUpdate(
				{ year: year, month: month },
				{ $set: { theme: '' } }
			)
			return `You have successfully removed the theme from ${month} ${year}`
		} catch (error) {
			return error
		}
	},
	async scheduledMessage(channel) {
		let year = new Date().getFullYear()
		const themesCollection = await themes()
		let month = new Date().getMonth()
		let day = new Date().getDay()

		if (month == 12 && day == 28) {
			let message = ``
			year = year + 1

			for (i = 0; i < months.length; i++) {
				const currentThemes = await themesCollection.findOne({ year: year, month: months[i] })
				if (currentThemes != null) {
					let month = await capitalize(currentThemes.month)
					message += `\n\t ${month}: ${currentThemes.theme}`
				}
			}
			const embed = new EmbedBuilder()
				.setTitle(`Themes for ${year}`)
				.setDescription(`${message}`)
				.setColor('DarkAqua')
			return channel.send({ embeds: [embed] })
		} else {
			let message = 'Reminder that the current themes for this year are: '

			for (i = 0; i < months.length; i++) {
				const currentThemes = await themesCollection.findOne({ year: year, month: months[i] })
				if (currentThemes != null) {
					let month = await capitalize(currentThemes.month)
					message += `\n\t ${month}: ${currentThemes.theme}`
				}
			}
			const embed = new EmbedBuilder().setDescription(`${message}`).setColor('DarkAqua')
			return channel.send({ embeds: [embed] })
		}
	},
}

module.exports = exportedMethods
