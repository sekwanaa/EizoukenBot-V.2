module.exports = {
	name: 'interactionCreate',

	async execute(interaction, client) {
		if (interaction.isChatInputCommand() || interaction.isContextMenuCommand()) {
			const command = interaction.client.commands.get(interaction.commandName)

			if (!command) {
				interaction.reply({ content: 'Outdated command' })
			}
			try {
				command.execute(interaction, client)
			} catch (error) {
				console.error(`Error executing ${interaction.commandName}`)
				console.error(error)
			}
		} else if (interaction.isButton()) {
			const roles = await interaction.guild.roles.fetch()
			const roleIdArr = roles.map(role => role.id)

			if (!roleIdArr.includes(interaction.customId)) return

			try {
				await interaction.member.roles.add(interaction.customId)
				return interaction.reply({
					content: `Thank you for agreeing to our rules, happy hunting 🥳`,
					ephemeral: true,
				})
			} catch (error) {
				console.log(error)
				return interaction.reply({
					content: 'Something went wrong',
					ephemeral: true,
				})
			}

			// console.log(interaction)
		} else if (interaction.isStringSelectMenu()) {
		} else {
			return
		}
	},
}
