const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('prune')
		.setDescription('Deletes a certain amount of user messages in a channel')
		.addIntegerOption(option =>
			option
				.setName('amount')
				.setDescription('Choose how many messages to delete')
				.setRequired(false)
		),

	async execute(interaction) {
		const { channel, options } = interaction
		const amount = options.getInteger('amount')

		const res = new EmbedBuilder().setColor(0x5fb041)

		if (amount) {
			if (amount >= 100) {
				return interaction.reply({
					content: 'The maximum amount of messages I can delete is 99.',
					ephemeral: true,
				})
			}

			const messages = await channel.messages.fetch({ limit: amount + 1 })
			let i = 0
			const filteredMessages = []

			;(await messages).filter(msg => {
				if (msg.author.id == interaction.user.id && amount > i) {
					filteredMessages.push(msg)
					i++
				}
			})

			try {
				await channel.bulkDelete(filteredMessages).then(messages => {
					res.setDescription(`Successfully deleted ${messages.size} of your messages from channel`)
					interaction.reply({ embeds: [res] })
				})
			} catch (error) {
				interaction.reply({ content: 'Sorry there was an issue completing your request.' })
			}
		} else {
			const messages = await channel.messages.fetch({ limit: 30 })
			let filteredMessages = []
			messages.forEach(message => {
				if (message.author.id == interaction.user.id) {
					filteredMessages.push(message)
				}
			})
			try {
				await channel.bulkDelete(filteredMessages).then(messages => {
					res.setDescription(
						`Successfully deleted ${messages.size} of your messages within the last 30 messages from the channel`
					)
					interaction.reply({ embeds: [res] })
				})
			} catch {
				interaction.reply({
					content: 'Sorry there was an issue completing your request.',
					ephemeral: true,
				})
			}
		}
	},
}
