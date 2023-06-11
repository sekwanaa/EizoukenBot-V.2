const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Deletes a certain amount of messages in a channel')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
		.addIntegerOption(option =>
			option
				.setName('amount')
				.setDescription('Choose how many messages to delete')
				.setRequired(false)
		)
		.addUserOption(option =>
			option
				.setName('target')
				.setDescription('Choose a specific person to delete messages for')
				.setRequired(false)
		),

	async execute(interaction) {
		const { channel, options } = interaction
		const amount = options.getInteger('amount') || 99
		const target = options.getUser('target')
		const messages = await channel.messages.fetch({ limit: amount + 1 })

		const res = new EmbedBuilder().setColor(0x5fb041)

		if (target) {
			let i = 0
			const filteredMessages = []

			messages.filter(msg => {
				if (msg.author.id == target.id && amount > i) {
					filteredMessages.push(msg)
					i++
				}
			})

			await channel.bulkDelete(filteredMessages).then(messages => {
				res.setDescription(`Successfully deleted ${messages.size} messages from ${target}`)
				interaction.reply({ embeds: [res] })
			})
		} else {
			await channel.bulkDelete(amount, true).then(messages => {
				res.setDescription(`Successfully deleted ${messages.size} from the channel`)
				interaction.reply({ embeds: [res] })
			})
		}
	},
}
