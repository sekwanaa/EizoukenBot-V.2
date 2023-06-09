const warningsData = require('../../data/warningData')
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('warning')
		.setDescription('Complete warning command.')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.addSubcommand(subcommand =>
			subcommand
				.setName('add')
				.setDescription('Add a warning.')
				.addUserOption(option =>
					option.setName('user').setDescription('User to add a warning to.').setRequired(true)
				)
				.addStringOption(option =>
					option.setName('reason').setDescription('Reason for warning.').setRequired(false)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('remove')
				.setDescription('Remove a warning.')
				.addUserOption(option =>
					option.setName('user').setDescription('User to remove a warning from.').setRequired(true)
				)
				.addNumberOption(option =>
					option.setName('id').setDescription('Case ID of warning').setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('check')
				.setDescription('Check warnings of a user.')
				.addUserOption(option =>
					option.setName('user').setDescription('User to check warnings for.').setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('clear')
				.setDescription('Clear all warnings of a user.')
				.addUserOption(option =>
					option.setName('user').setDescription('User to clear warnings from.').setRequired(true)
				)
		),

	async execute(interaction) {
		const { options } = interaction
		const user = options.getUser('user')
		const subcommand = options.getSubcommand()
		const userWarnings = await warningsData.getWarnings(user.id)

		switch (subcommand) {
			case 'add':
				try {
					const caseID = () => (userWarnings.length === 0 ? 0 : userWarnings.length)
					const reason = options.getString('reason') || 'No reason provided.'
					const executor = interaction.user.tag
					const warnDate = new Date(interaction.createdTimestamp).toLocaleDateString()
					await warningsData.addWarning(caseID(), user, reason, executor, warnDate)
					interaction.reply({
						content: `Successfully added a warning for ${user.tag}.`,
						ephemeral: true,
					})
				} catch (error) {
					console.log('theres been an error')
					console.error(error)
				}
				break
			case 'remove':
				try {
					const caseID = options.getNumber('id') - 1
					await warningsData.removeWarning(caseID, user.id)
					await warningsData.updateWarnings(user.id)
					await interaction.reply({
						content: `Case: ${caseID + 1} successfully removed from ${user.tag}`,
						ephemeral: true,
					})
				} catch (error) {
					await interaction.reply({
						content: `Case: ${caseID + 1} could not be removed from ${user.tag}`,
						ephemeral: true,
					})
				}
				break
			case 'check':
				try {
					const userWarnings = await warningsData.getWarnings(user.id)

					if (userWarnings.length === 0) {
						const embed = new EmbedBuilder()
							.setDescription(
								`${user.tag} has no warnings.
                        `
							)
							.setFooter({
								text: `${interaction.member.user.tag}`,
								iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }),
							})
						await interaction.reply({ embeds: [embed], ephemeral: true })
						return
					}

					const embed = new EmbedBuilder()
						.setDescription(
							`${userWarnings
								.map(
									(warning, index) =>
										`
						**caseID**: ${index + 1}
						**executor**: ${warning.executor}
						**reason**: ${warning.reason}
						**date**: ${warning.warnDate}\n
						`
								)
								.join(' ')}`
						)
						.setFooter({
							text: `${interaction.member.user.tag}`,
							iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }),
						})
					await interaction.reply({ embeds: [embed], ephemeral: true })
				} catch (error) {
					console.error(error)
				}
				break
			case 'clear':
				try {
					await warningsData.clearWarnings(user.id)
					await interaction.reply({
						content: `Successfully cleared all warnings for ${user.tag}.`,
						ephemeral: true,
					})
				} catch (error) {
					console.error(error)
					await interaction.reply({
						content: 'There was an error while trying to clear warnings from this user.',
						ephemeral: true,
					})
				}
				break
		}
	},
}
