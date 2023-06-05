const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('softban')
		.setDescription('Softban a user')
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
		.addUserOption(option =>
			option.setName('user').setDescription('The user to softban').setRequired(true)
		)
		.addStringOption(option =>
			option.setName('reason').setDescription('The reason to softban').setRequired(false)
		),

	async execute(interaction) {
		const { guild, member, options } = interaction
		const user = options.getUser('user')
		const reason = options.getString('reason')

		const guildMember = await member.guild.members.fetch(user.id)

		if (guildMember.roles.highest.position >= member.roles.highest.position) {
			const errEmbed = new EmbedBuilder().setDescription(
				`You cannot softban ${user.username} because their role is the same or higher than you.`
			)

			interaction.reply({ embeds: [errEmbed], ephemeral: true })
		} else {
			try {
				await guildMember.ban({ deleteMessageSeconds: 604800, reason: reason })
				await guild.members.unban(user)

				const embed = new EmbedBuilder()
					.setDescription(`${user.username} has been successfully softbanned for reason: ${reason}`)
					.setTimestamp()

				interaction.reply({ embeds: [embed], ephemeral: true })
			} catch (error) {
				console.log(error)
				interaction.reply({
					content: `Sorry there was an error completing your softban request`,
					ephemeral: true,
				})
			}
		}
	},
}
