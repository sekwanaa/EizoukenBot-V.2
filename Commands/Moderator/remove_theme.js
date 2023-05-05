const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits } = require("discord.js");
const themesData = require("../../data/themesData")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("remove_theme")
    .setDescription("Allows user to add/change a theme for a month")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption(option => 
        option
        .setName("month")
        .setDescription("Choose a month to add/update a theme for")
        .setRequired(true)
    )
    .addIntegerOption(option => 
        option
        .setName("year")
        .setDescription("Choose a year to add the theme to")
        .setRequired(false)
    ),

    async execute(interaction) {
        const { channel, options } = interaction;
        const month = options.getString("month");
        const year = options.getInteger("year");
        if (year) {
            const action = await themesData.removeThemeData(month, year)
            interaction.reply({content: `${action}`})
        }
        else {
            const year = new Date().getFullYear();
            const action = await themesData.removeThemeData(month, year)
            interaction.reply({content: `${action}`})
        }
    },
}