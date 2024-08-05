const {
	ContextMenuCommandBuilder,
	ApplicationCommandType,
	EmbedBuilder,
	PermissionFlagsBits,
} = require('discord.js')

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('Kick User')
		.setType(ApplicationCommandType.User)
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
	async execute(interaction) {
		const target = await interaction.guild.members.fetch(interaction.targetUser.id)
		const guildMember = interaction.member

		if (target.roles.highest.position >= guildMember.roles.highest.position) {
			const errEmbed = new EmbedBuilder().setDescription(
				`You cannot kick ${target.username} because their role is the same or higher than you.`
			)

			interaction.reply({ embeds: [errEmbed], ephemeral: true })
		} else {
			try {
				const reason = 'You were being naughty'
				await target.kick({ reason: reason })

				const embed = new EmbedBuilder()
					.setDescription(
						`${target.user.username} has been successfully kicked for reason: ${reason}`
					)
					.setTimestamp()

				interaction.reply({ embeds: [embed], ephemeral: true })
			} catch (error) {
				console.log(error)
				interaction.reply({
					content: `Sorry there was an error completing your kick request`,
					ephemeral: true,
				})
			}
		}
	},
}
