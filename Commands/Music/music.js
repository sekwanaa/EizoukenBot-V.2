const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, VoiceChannel, GuildEmoji } = require("discord.js");
const client = require("../../index")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("music")
    .setDescription("Complete music commands.")
    .addSubcommand(subcommand => 
        subcommand.setName("play")
        .setDescription("Plays a song or adds it to the queue if there is a song currently playing")
        .addStringOption(option => 
            option.setName("query")
            .setDescription("Song name or url.")
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand => 
        subcommand.setName("pause")
        .setDescription("Pause the queue")
    )
    .addSubcommand(subcommand => 
        subcommand.setName("resume")
        .setDescription("Resume the queue")
    )
    .addSubcommand(subcommand => 
        subcommand.setName("skip")
        .setDescription("Skip current song")
    )
    .addSubcommand(subcommand => 
        subcommand.setName("stop")
        .setDescription("Stop the queue")
    )
    .addSubcommand(subcommand => 
        subcommand.setName("volume")
        .setDescription("Adjust song volume")
        .addIntegerOption(option => 
            option.setName("percent")
            .setDescription("10 = 10%")
            .setMinValue(1)
            .setMaxValue(100)
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand => 
        subcommand.setName("queue")
        .setDescription("View the queue")
    ),

    async execute(interaction) {
        const {options, member, guild, channel}=interaction;
        const query = options.getString("query");
        const volume = options.getInteger("percent");
        const subcommand = options.getSubcommand();
        const voiceChannel = member.voice.channel;

        const embed = new EmbedBuilder();

        if (!voiceChannel) {
            embed.setColor("Red").setDescription("You need to be in a voice channel to execute music commands.")
            return interaction.reply({embeds: [embed], ephemeral: true})
        }
        if (!member.voice.channel == guild.members.me.voice.channelId) {
            embed.setColor("Red").setDescription("I can only be used in one channel at a time.")
            return interaction.reply({embeds: [embed], ephemeral: true})
        }
        const queue = await client.distube.getQueue(voiceChannel)
        try {
            switch (subcommand) {
                    case "play":
                        if (!queue) {
                            client.distube.play(voiceChannel, query, {textChannel: channel, member: member})
                            return interaction.reply({content: `🎶 Request received`, ephemeral: true});
                        }
                        client.distube.play(voiceChannel, query, {textChannel: channel, member: member})
                        return interaction.reply({content: `🎶 Request received`, ephemeral: true});
                    case "pause":
                        if (!queue) {
                            embed.setColor("Red").setDescription("Sorry, there is no queue")
                            return interaction.reply({embeds: [embed], ephemeral: true})
                        }
                        await queue.pause(voiceChannel);
                        embed.setColor("Orange").setDescription("⏸️ | Paused song")
                        return interaction.reply({embeds: [embed], ephemeral: true})
                    case "resume":
                        if (!queue) {
                            embed.setColor("Red").setDescription("Sorry, there is no queue")
                            return interaction.reply({embeds: [embed], ephemeral: true})
                        }
                        queue.resume(voiceChannel);
                        embed.setColor("Green").setDescription("⏯️ | Resumed song")
                        return interaction.reply({embeds: [embed], ephemeral: true})
                    case "skip":
                        if (!queue) {
                            embed.setColor("Red").setDescription("Sorry, there is no queue")
                            return interaction.reply({embeds: [embed], ephemeral: true})
                        }
                        await queue.skip(voiceChannel);
                        embed.setColor("Purple").setDescription("⏩ | Skipped song")
                        return interaction.reply({embeds: [embed], ephemeral: true});
                    case "stop":
                        if (!queue) {
                            embed.setColor("Red").setDescription("Sorry, there is no queue")
                            return interaction.reply({embeds: [embed], ephemeral: true})
                        }
                        await queue.stop(voiceChannel);
                        embed.setColor("Red").setDescription("Stopped playing songs!")
                        return interaction.reply({embeds: [embed], ephemeral: true});
                    case "volume":
                        if (!queue) {
                            embed.setColor("Red").setDescription("Sorry, there is no queue")
                            return interaction.reply({embeds: [embed], ephemeral: true})
                        }
                        client.distube.setVolume(voiceChannel, volume);
                        return interaction.reply({content: `Volume set to ${volume}%`, ephemeral: true});
                    case "queue":
                        if (!queue) {
                            embed.setColor("Red").setDescription("Sorry, there is no queue")
                            return interaction.reply({embeds: [embed], ephemeral: true})
                        }
                        embed.setColor("Blue").setDescription(`${queue.songs.map((song, id) =>
                            `\n**${id + 1}.** ${song.name} -\` ${song.formattedDuration}\``
                        )}`)
                        return interaction.reply({embeds: [embed], ephemeral: true})
            }
        } catch (error) {
            console.log(error)
            interaction.reply({content: "sorry something went wrong with your request", ephermeral: true})
        }
    },
}