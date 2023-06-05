const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const autoProfilePicChangeCommand = require('../../tools/Automation/autoProfilePicChange')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('changebotavatar')
		.setDescription('Change bot avatar')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

	async execute(interaction, client) {
		let cooldown = client.cooldowns
		const cooldownTimer = 30000
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
			await autoProfilePicChangeCommand.autoProfilePicChange(interaction, client)
			cooldown.set(interaction.user.id, Date.now())
			setTimeout(() => {
				cooldown.delete(interaction.user.id)
			}, cooldownTimer)
		}
	},
}
