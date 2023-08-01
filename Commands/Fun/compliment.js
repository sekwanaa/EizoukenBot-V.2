const { SlashCommandBuilder } = require('discord.js')
const responseData = require('../../data/automatedResponsesData')

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
				.setDescription('What would you like to say to them?')
				.setRequired(false)
		),

	async execute(interaction) {
		const { options } = interaction
		const target = options.getUser('target')
		const compliment = options.getString('compliment')

		try {
			const responses = await responseData.getResponses()
			const num = Math.floor(Math.random() * (responses.length - 1) + 1)

			if (compliment) {
				interaction.reply({ content: `${target}, ${compliment}` })
			} else {
				interaction.reply({ content: `${target}, ${responses[num].message}` })
			}
		} catch (error) {
			console.log(error)
		}
	},
}
