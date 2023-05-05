const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Helps the user by seeing all of the available commands and how to use them"),

    execute(interaction) {
        interaction.reply({content: "I see you need some help with the Eizouken Bot\n\nHere are some useful commands for you to use:\n{parameter} -- Optional\n\n***<?themes> {year}*** shows an overview of the themes. Optionally able to choose year to view\n***<?add_theme> <month> <theme> {year}*** allows you to add a theme. Optionally able to choose year to add a theme to.\n***<?remove_theme> <month> {year}*** allows you to remove a theme from a month, and optionally the year.\n***<?playing> <argument>*** allows you to see who is playing <argument>\n***<?prune> {# of messages}*** allows you to all of your messages within the last 30 in the channel.", ephemeral: true})
    },
}