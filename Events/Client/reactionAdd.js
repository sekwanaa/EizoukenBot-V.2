const tallyBoardData = require('../../data/tallyBoardData')
const { EmbedBuilder } = require('discord.js')

module.exports = {
	name: 'messageReactionAdd',
	once: false,
	async execute(messageReaction, User, client) {
		const reactionUser = User.username
		const reactionEmoji = messageReaction._emoji.name
		try {
			const guildData = await tallyBoardData.getTallyBoard(messageReaction.message.guildId)
			if (guildData !== null) {
				const { channelId, messageId } = guildData
				const tallyBoardMessage = await client.channels
					.fetch(channelId)
					.then(channel => channel.messages.fetch(messageId))

				const updatedEmbed = new EmbedBuilder(tallyBoardMessage.embeds[0])
				updatedEmbed.addFields({
					name: reactionUser,
					value: `${reactionEmoji}: ${messageReaction.count}`,
					inline: true,
				})

				tallyBoardMessage.edit({ embeds: [updatedEmbed] })
			} else {
				return
			}
		} catch (error) {
			console.log(error)
		}
	},
}
