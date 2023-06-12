const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const autoProfilePicChangeCommand = require('../../tools/Automation/autoProfilePicChange')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('change-bot-avatar')
		.setDescription('Change bot avatar')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.addStringOption(option =>
			option
				.setName('query')
				.setDescription('Query to use to search for bot avatar')
				.setRequired(false)
		),

	async execute(interaction, client) {
		const query = interaction.options.getString('query')
		let cooldown = client.cooldowns
		const cooldownTimer = 10000
		if (cooldown.has(interaction.user.id)) {
			const cooldownExpirationTime = cooldown.get(interaction.user.id) + cooldownTimer
			const timeLeft = cooldownExpirationTime - Date.now()
			if (timeLeft > 0) {
				interaction.reply({
					content: `Please wait ${Math.ceil(
						timeLeft / 1000
					)} seconds before you use the command again.`,
					ephemeral: true,
				})
			}
		} else {
			await autoProfilePicChangeCommand.autoProfilePicChange(interaction, client, query)
			cooldown.set(interaction.user.id, Date.now())
			setTimeout(() => {
				cooldown.delete(interaction.user.id)
			}, cooldownTimer)
		}
	},
}
