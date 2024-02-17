const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const client = require('../../index')

module.exports = {
	data: new SlashCommandBuilder().setName('shuffle').setDescription('Shuffles current playlist'),

	async execute(interaction) {
		try {
			const { member } = interaction
			const voiceChannel = member.voice.channel
			const queue = await client.distube.getQueue(voiceChannel)

			if (!queue) {
				return await interaction.reply({
					content: 'There are no songs in the queue.',
					ephemeral: true,
				})
			}

			queue.shuffle()
			await interaction.reply({
				content: `The queue of ${queue.tracks.length} songs have been shuffled!`,
				ephemeral: true,
			})
		} catch (error) {
			console.log(error)
			interaction.reply({
				content: 'sorry something went wrong with your request',
				ephermeral: true,
			})
		}
	},
}
