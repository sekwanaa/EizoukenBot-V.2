const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder().setName('bot-info').setDescription('Bot Info'),

	async execute(interaction, client) {
		const { uptime } = client
		console.log(client.user)

		const embed = new EmbedBuilder()
			.setAuthor({
				name: `${client.user.tag}`,
				iconURL: client.user.displayAvatarURL({ dynamic: true }),
			})
			.addFields(
				{ name: 'Guilds', value: `${1}`, inline: true },
				{ name: 'Uptime', value: `${Math.floor(uptime / 60000)} minutes` }
			)
			.setTimestamp()
			.setColor('Gold')

		await interaction.reply({ embeds: [embed], ephemeral: true })
	},
}
