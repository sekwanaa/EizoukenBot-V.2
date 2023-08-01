const { SlashCommandBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('compliment')
		.setDescription('Compliment someone with something nice...?')
		.addUserOption(option =>
			option
				.setName('target')
				.setDescription('who would you like to send the compliment to?')
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName('compliment')
				.setDescription('What woud you like to say to them?')
				.setRequired(true)
		),

	async execute(interaction) {
		const { options } = interaction
		const target = options.getRole('target')
		const compliment = options.getString('compliment')

		interaction.reply({ content: `${target}, ${compliment}` })
	},
}
