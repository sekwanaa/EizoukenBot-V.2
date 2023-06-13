const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('embed')
		.setDescription('Creates a message embed')
		.addStringOption(option =>
			option.setName(`content`).setDescription('The content of the embed').setRequired(true)
		)
		.addStringOption(option =>
			option.setName('title').setDescription('The title of the embed').setRequired(false)
		),

	async execute(interaction) {
		const { options } = interaction
		const title = options.getString(`title`)
		const content = options.getString(`content`)
		const splitContent = content.split('\\n')
		const reassembledContent = splitContent.join('\n')
		const embed = new EmbedBuilder().setTitle(title || null).setDescription(reassembledContent)

		return interaction.reply({ embeds: [embed] })
	},
}
