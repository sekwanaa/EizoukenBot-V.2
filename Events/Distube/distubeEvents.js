const client = require('../../index')

const status = queue =>
	`Volume: \`${queue.volume}%\` | Filter: \`${
		queue.filters.names.join(', ') || 'Off'
	}\` | Loop: \`${
		queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'
	}\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``
client.distube
	.on('playSong', (queue, song) =>
		queue.textChannel.send(
			`🎶 | Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${
				song.user
			}\n${status(queue)}`
		)
	)
	// .on("addSong", (queue, song) =>
	//   queue.textChannel.send(`🎶 | Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`)
	// )
	// .on("addList", (queue, playlist) =>
	//   queue.textChannel.send(
	//     `🎶 | Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to queue\n${status(queue)}`
	//   )
	// )
	.on('error', (e, queue) => {
		if (queue) queue.textChannel.send(`🛑 | An error encountered: ${e.toString().slice(0, 1974)}`)
		else console.error(e)
	})
	.on('empty', queue => queue.textChannel.send('Voice channel is empty! Leaving the channel...'))
	.on('searchNoResult', (message, query) =>
		message.channel.send(`🛑 | No result found for \`${query}\`!`)
	)
// .on("finish", (queue) => queue.textChannel.send("Finished!"));
