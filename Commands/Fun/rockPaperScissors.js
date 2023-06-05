const { SlashCommandBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rps')
		.setDescription('Rock Paper Scissors')
		.addStringOption(option =>
			option.setName('choice').setDescription('rock, paper or scissors').setRequired(true)
		),

	async execute(interaction) {
		const { options } = interaction
		let choice = options.getString('choice')
		if (choice === 'rock' || choice === 'Rock' || choice === '1' || choice === 'r') {
			choice = 'rock'
		} else if (choice === 'paper' || choice === 'Paper' || choice === '2' || choice === 'p') {
			choice = 'paper'
		} else if (choice === 'scissors' || choice === 'Scissors' || choice === '3' || choice === 's') {
			choice = 'scissors'
		} else {
			return interaction.reply({
				content: 'Please choose a valid choice.',
				ephemeral: true,
			})
		}
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
