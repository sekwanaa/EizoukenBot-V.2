const themesData = require('../../data/themesData')

module.exports = {
	name: 'guildUpdate',
	once: false,
	async execute(oldGuild, client) {
		await themesData.updateGuild(client.id, client.name)
	},
}
