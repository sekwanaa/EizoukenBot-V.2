const tallyBoardData = require('../../data/tallyBoardData')
const { EmbedBuilder } = require('discord.js')

module.exports = {
	name: 'messageReactionAdd',
	once: false,
	async execute(messageReaction, User, client) {
		if (messageReaction.me) return //* doesn't work if bot reacts otherwise its an infinite loop
		if (!messageReaction.message.author) return //* only cached messages will work

		const reactionUser = `${User.username}#${User.discriminator}`
		const reactedUser = `${messageReaction.message.author.username}#${messageReaction.message.author.discriminator}`
		if (!messageReaction._emoji.id) {
			var reactionEmoji = messageReaction._emoji.name
		}
		const customEmoji = client.emojis.cache.get(messageReaction._emoji.id) || null
		console.log(reactionEmoji)
		console.log(customEmoji)
		try {
			const guildData = await tallyBoardData.getTallyBoard(messageReaction.message.guildId) //* checks if the guild has a tally board channel
			if (guildData !== null) {
				// if it does
				const { channelId } = guildData
				const tallyBoardChannel = await client.channels.fetch(channelId)

				const messagesWithEmbed = await tallyBoardChannel.messages //*fetches messages with embeds
					.fetch({ limit: 100 })
					.then(message => message.filter(m => m.embeds))

				if (messagesWithEmbed.size == 0) {
					console.log(`there is no message with an embed`)
					//* if there is no message with an embed creates a new embed with user tag and the emoji that was reacted with
					const embed = new EmbedBuilder()
						.setAuthor({
							name: messageReaction.message.author.tag,
						})
						.addFields({
							name: `${customEmoji || reactionEmoji}`,
							value: '1',
							inline: true,
						})

					return await tallyBoardChannel.send({ embeds: [embed] })
				} else {
					console.log(`there is a message with an embed`)
					const reactedUserTally = messagesWithEmbed.map(m => m)
					const embedContent = reactedUserTally.map(m => m.embeds[0]) || null //*fetches the first embed in the message (there should only be one)

					if (embedContent[0].author.name === reactedUser) {
						//* if the author of the embed is the same as the user who was reacted to edits the content of the embed
						if (
							embedContent[0].fields.map(field => field.name).includes(customEmoji || reactionEmoji)
						) {
							const fieldData = embedContent[0].fields.map((field, index) => {
								return {
									i: index,
									name: field.name,
									value: field.value,
								}
							})
							console.log(`-----------Field Data-----------`)
							console.log(fieldData)
							console.log(`----------ReactedEmoji------------`)

							// let reactedEmoji = {}

							//TODO: figure out how to find the correct field to update
							const reactedEmoji = fieldData.find(
								field => field.name == customEmoji || reactionEmoji
							)

							// await fieldData.forEach(field => {
							// 	console.log(field)
							// 	if (field.name == customEmoji || reactionEmoji) {
							// 		reactedEmoji = {
							// 			i: field.i,
							// 			name: field.name,
							// 			value: field.value,
							// 		}
							// 	}
							// })

							console.log(reactedEmoji)
							console.log(reactedEmoji.name, reactionEmoji)
							console.log(`--------------------------------`)

							const emojiCount = reactedEmoji.value

							const updatedEmbed = new EmbedBuilder(embedContent[0])
							updatedEmbed.data.fields[reactedEmoji.i].value = parseInt(emojiCount) + 1

							return reactedUserTally[0].edit({ embeds: [updatedEmbed] })
						}
						const updatedEmbed = new EmbedBuilder(embedContent[0])
						updatedEmbed.addFields({
							name: `${customEmoji || reactionEmoji}`,
							value: '1',
							inline: true,
						})

						return reactedUserTally[0].edit({ embeds: [updatedEmbed] })
					} else {
						const embed = new EmbedBuilder()
							.setAuthor({
								name: messageReaction.message.author.tag,
							})
							.addFields({
								name: `${customEmoji || reactionEmoji}`,
								value: '1',
								inline: true,
							})

						return await tallyBoardChannel.send({ embeds: [embed] })
					}
				}
			} else {
				return
			}
		} catch (error) {
			console.log(error)
		}
	},
}
