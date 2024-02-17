const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const client = require('../../index')

module.exports = {
	data: new SlashCommandBuilder().setName('shuffle').setDescription('Shuffles current playlist'),

	async execute(interaction) {
		try {
			const queue = client.player.getQueue(interaction.guildId)

			if (!queue) {
				return await interaction.editReply('There are no songs in the queue.')
			}

			queue.shuffle()
			await interaction.reply({
				content: 'The queue has been successfully shuffled!',
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
