const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const responseData = require('../../data/automatedResponsesData')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pet')
		.setDescription('Spread some love, pet someone')
		.addUserOption(option =>
			option.setName('target').setDescription('Who would you like to pet?').setRequired(true)
		),

	async execute(interaction) {
		const { options } = interaction
		const target = options.getUser('target')

		try {
			const responses = await responseData.getResponses()
			const num = Math.floor(Math.random() * (responses.length - 1) + 1)

			const embed = new EmbedBuilder().setDescription(`${target} ${responses[num]?.message}`)

			interaction.reply({ embeds: [embed] })
		} catch (error) {
			console.log(error)
		}
	},
}
