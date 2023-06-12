const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server-info')
		.setDescription('gives information about the server'),

	async execute(interaction, client) {
		const { guild } = interaction

		const embed = new EmbedBuilder()
			.setAuthor({ name: `${guild.name}`, iconURL: guild.iconURL() })
			.setThumbnail(guild.iconURL())
			.addFields(
				{ name: 'Created At', value: `${guild.createdAt}` },
				{ name: 'Members', value: `${guild.memberCount}`, inline: true },
				{ name: 'Channels', value: `${guild.channels.cache.size}`, inline: true }
			)
			.setTimestamp()
			.setColor('Gold')

		await interaction.reply({ embeds: [embed], ephemeral: true })
	},
}
