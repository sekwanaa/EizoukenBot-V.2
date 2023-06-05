require('dotenv').config()
const themesData = require('../../data/themesData')
const { googleAPIKey, customSearchEngineID } = process.env

let exportedModules = {
	async autoProfilePicChange(client) {
		const year = new Date().getFullYear()
		const month = new Intl.DateTimeFormat('en-US', { month: 'long' })
			.format(new Date())
			.toLowerCase()
		const imageChoiceNumebr = Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10)
		console.log(year, month)
		let searchQuery = await themesData.getThemes(year, month)
		console.log(searchQuery)

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
							const imageURL = data.items[imageChoiceNumebr].link
							console.log('Fetched image URL:', imageURL)
							// Additional code to update the bot's profile picture
							client.user
								.setAvatar(imageURL)
								.then(() => console.log('Bot profile picture updated successfully!'))
								.catch(console.error)
						} else {
							console.log('No images found for the search query.')
						}
					})
					.catch(console.error)
			})
			.catch(console.error)
	},
}

module.exports = exportedModules
