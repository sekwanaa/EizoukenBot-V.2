const guildTool = require('../../tools/Guild/updateGuild')

module.exports = {
	name: 'guildUpdate',
	once: false,
	async execute(oldGuild, client) {
		await guildTool.updateGuild(client.id, client.name)
	},
}
