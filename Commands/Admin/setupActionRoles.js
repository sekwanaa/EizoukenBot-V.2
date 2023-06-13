const {
	SlashCommandBuilder,
	ActionRowBuilder,
	ButtonStyle,
	ButtonBuilder,
	PermissionFlagsBits,
} = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('button-role')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDescription(`Complete button role commands`)
		.addSubcommand(subcommand =>
			subcommand
				.setName(`create`)
				.setDescription(`Add a button role`)
				.addStringOption(option =>
					option.setName(`label`).setDescription(`The label of the button`).setRequired(true)
				)
				.addRoleOption(option =>
					option.setName(`role`).setDescription(`The role your button will give`).setRequired(true)
				)
				.addStringOption(option =>
					option
						.setName(`type`)
						.setDescription(`The type of the button`)
						.setRequired(false)
						.setChoices(
							{
								name: `Success`,
								value: `Success`,
							},
							{
								name: `Primary`,
								value: `Primary`,
							},
							{
								name: `Danger`,
								value: `Danger`,
							},
							{
								name: `Secondary`,
								value: `Secondary`,
							},
							{
								name: `Link`,
								value: `Link`,
							}
						)
				)
		),

	async execute(interaction) {
		const { options } = interaction
		const subcommand = options.getSubcommand()

		switch (subcommand) {
			case 'create':
				const label = options.getString(`label`)
				const customId = options.getRole(`role`)
				const buttonType = options.getString(`type`)

				const button = new ButtonBuilder()
					.setCustomId(customId.id)
					.setLabel(label)
					.setStyle(buttonType || ButtonStyle.Success)

				const actionRow = new ActionRowBuilder().addComponents(button)

				await interaction.channel.send({ components: [actionRow] })

				break
			case 'remove':
				break
		}
	},
}
