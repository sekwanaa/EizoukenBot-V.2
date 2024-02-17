const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const client = require('../../index')

module.exports = {
	data: new SlashCommandBuilder().setName('shuffle').setDescription('Shuffles current playlist'),

	async execute(interaction) {
		try {
			const { member } = interaction
			const voiceChannel = member.voice.channel
			const queue = await client.distube.getQueue(voiceChannel)
			const embed = new EmbedBuilder()

			if (!queue) {
				embed.setColor('Red').setDescription('There is no queue to shuffle.')
				return interaction.reply({ embeds: [embed], ephemeral: true })
			}

			queue.shuffle()
			embed
				.setColor('Blue')
				.setDescription(`Successfully shuffled ${queue.songs.length} songs in the queue.`)
			return interaction.reply({ embeds: [embed], ephemeral: true })
		} catch (error) {
			console.log(error)
			interaction.reply({
				content: 'sorry something went wrong with your request',
				ephermeral: true,
			})
		}
	},
}
