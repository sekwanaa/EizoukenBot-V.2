const guildModeratorData = require('../../data/guildModeratorData')
const { SlashCommandBuilder, PermissionsBitField, PermissionFlagsBits } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mod-role')
		.setDescription('Moderator role management')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addSubcommand(subcommand =>
			subcommand
				.setName('add')
				.setDescription('Add a moderator')
				.addRoleOption(option =>
					option.setName('role').setDescription('Role to add as a moderator.').setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('remove')
				.setDescription('Remove a moderator role')
				.addRoleOption(option =>
					option.setName('role').setDescription('Role to remove as moderator.').setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand.setName('list').setDescription('Lists all Moderator Roles')
		),

	async execute(interaction) {
		const { options, guild, guildId } = interaction
		const subcommand = options.getSubcommand()
		const roleId = options?.getRole('role')?.id
		const role = guild.roles.cache.get(roleId)
		const botMember = guild.members.me

		if (role?.comparePositionTo(botMember.roles.highest) >= 0) {
			return interaction.reply({
				content: "I can't edit this role because it's higher or equal to my highest role.",
				ephemeral: true,
			})
		}

		if (!botMember.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
			return interaction.reply({
				content: "I don't have the ManageRoles permission.",
				ephemeral: true,
			})
		}

		switch (subcommand) {
			case 'add': {
				try {
					// Add specific permissions from the role
					const currentPermissions = role.permissions
					const updatedPermissions = new PermissionsBitField(currentPermissions).add(
						PermissionsBitField.Flags.KickMembers,
						PermissionsBitField.Flags.BanMembers,
						PermissionsBitField.Flags.ManageMessages,
						PermissionsBitField.Flags.ManageChannels,
						PermissionsBitField.Flags.CreateEvents,
						PermissionsBitField.Flags.ManageEvents,
						PermissionsBitField.Flags.ModerateMembers
					)

					// Edit the role's permissions
					await role.edit({
						permissions: updatedPermissions,
					})

					await guildModeratorData.addModerator(guildId, role.id)

					interaction.reply({
						content: `Successfully added ${role.name} as moderators.`,
						ephemeral: true,
					})
				} catch (error) {
					console.log(`theres been an error adding ${role.name} as moderators`)
					console.error(error)
				}
				break
			}
			case 'remove': {
				const role = options.getRole('role')
				try {
					// Remove specific permissions from the role
					const currentPermissions = role.permissions
					const updatedPermissions = new PermissionsBitField(currentPermissions).remove(
						PermissionsBitField.Flags.KickMembers,
						PermissionsBitField.Flags.BanMembers,
						PermissionsBitField.Flags.ManageMessages,
						PermissionsBitField.Flags.ManageChannels,
						PermissionsBitField.Flags.CreateEvents,
						PermissionsBitField.Flags.ManageEvents,
						PermissionsBitField.Flags.ModerateMembers
					)

					// Edit the role's permissions
					await role.edit({
						permissions: updatedPermissions,
					})

					const deletedCount = await guildModeratorData.removeModerator(guildId, role.id)

					if (deletedCount === 0) {
						return interaction.reply({
							content: `${role.name} are not a moderators.`,
							ephemeral: true,
						})
					}

					interaction.reply({
						content: `Successfully removed ${role.name} as moderators.`,
						ephemeral: true,
					})
				} catch (error) {
					console.log(`theres been an error removing ${role.name} as moderators`)
					console.error(error)
				}
				break
			}
			case 'list': {
				try {
					const moderatorRoles = await guildModeratorData.getModerators(guildId)
					let listOfRoles = []

					await moderatorRoles.map(async entry => {
						const role = await guild.roles.fetch(entry.roleId)

						listOfRoles.push(role)
					})

					return interaction.reply({
						content: `${listOfRoles}`,
						ephemeral: true,
					})
				} catch (error) {
					console.log(`theres been an error finding moderator roles for your guild.`)
					console.error(error)
				}
				break
			}
		}
	},
}
