const { SlashCommandBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rps')
		.setDescription('Rock Paper Scissors')
		.addStringOption(option =>
			option
				.setName('choice')
				.setDescription('rock, paper or scissors')
				.setChoices(
					{ name: 'Rock', value: 'rock' },
					{ name: 'Paper', value: 'paper' },
					{ name: 'Scissors', value: 'scissors' }
				)
				.setRequired(true)
		),

	async execute(interaction) {
		const { options } = interaction
		let choice = options.getString('choice')
		const botNumber = Math.floor(Math.random() * 3) + 1
		let botChoice = ''
		botNumber === 1
			? (botChoice = 'rock')
			: botNumber === 2
			? (botChoice = 'paper')
			: botNumber === 3
			? (botChoice = 'scissors')
			: botChoice === 'scissors'

		if (botChoice === choice) {
			return interaction.reply({
				content: `You chose ${choice} and the bot chose ${botChoice}, it's a tie.`,
				ephemeral: true,
			})
		}

		if (botChoice == 'rock' && choice !== 'paper') {
			return interaction.reply({
				content: `You chose ${choice} and the bot chose ${botChoice}, you lose.`,
				ephemeral: true,
			})
		} else if (botChoice == 'paper' && choice !== 'scissors') {
			return interaction.reply({
				content: `You chose ${choice} and the bot chose ${botChoice}, you lose.`,
				ephemeral: true,
			})
		} else if (botChoice == 'scissors' && choice !== 'rock') {
			return interaction.reply({
				content: `You chose ${choice} and the bot chose ${botChoice}, you lose.`,
				ephemeral: true,
			})
		} else {
			return interaction.reply({
				content: `You chose ${choice} and the bot chose ${botChoice}, you win!`,
				ephemeral: true,
			})
		}
	},
}
