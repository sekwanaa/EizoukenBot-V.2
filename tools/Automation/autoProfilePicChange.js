require('dotenv').config()
const themesData = require('../../data/themesData')
const { googleAPIKey, customSearchEngineID } = process.env

let exportedModules = {
	async autoProfilePicChange(interaction, client, query) {
		const year = new Date().getFullYear()
		const month = new Intl.DateTimeFormat('en-US', { month: 'long' })
			.format(new Date())
			.toLowerCase()
		const imageChoiceNumber = Math.floor(Math.random() * 10 + Math.round(Math.random() * 3))
		let searchQuery = query || (await themesData.getThemes(year, month))
		console.log(searchQuery, imageChoiceNumber)

		import('node-fetch')
			.then(fetch => {
				// Perform image search
				fetch
					.default(
						`https://www.googleapis.com/customsearch/v1?key=${googleAPIKey}&cx=${customSearchEngineID}&searchType=image&q=${encodeURIComponent(
							searchQuery
						)}`
					)
					.then(response => response.json())
					.then(data => {
						if (data.items && data.items.length > 0) {
							try {
								var imageURL = data.items[imageChoiceNumber].link
							} catch (error) {
								setTimeout(() => {
									this.autoProfilePicChange(interaction, client)
									return
								}, 5000)
							}
							console.log('Fetched image URL:', imageURL)
							// Additional code to update the bot's profile picture
							client.user
								.setAvatar(imageURL)
								.then(
									interaction.reply({
										content: 'Bot profile picture updated successfully!',
										ephemeral: true,
									})
								)
								.catch(console.error)
						} else {
							return interaction.reply({
								content: 'No images found for the search query.',
								ephemeral: true,
							})
						}
					})
					.catch(console.error)
			})
			.catch(console.error)
	},
}

module.exports = exportedModules
