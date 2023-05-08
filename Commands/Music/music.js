const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
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
        )
    ),

    async execute(interaction) {
        const {channel, options} =interaction;
        const query = options.getString("query");
        console.log(query)
    },
}