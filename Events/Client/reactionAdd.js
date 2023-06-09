module.exports = {
	name: 'messageReactionAdd',
	once: false,
	async execute(messageReaction, User, client) {
		console.log(messageReaction)
		console.log(`----------------------BREAK-------------------`)
		console.log(User)
		// TODO: fetch user name, and the emoji and add it to the tally board
		console.log('reaction added')
	},
}
