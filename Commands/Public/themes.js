const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits } = require("discord.js");
const themesData = require("../../data/themesData")


module.exports = {
    data: new SlashCommandBuilder()
    .setName("themes")
    .setDescription("Allows user to see the current themes of the year")
    .addIntegerOption(option => 
        option.setName("year")
        .setDescription("Choose a year to see themes from")
        .setRequired(false)
    ),

    async execute(interaction) {
        const { channel, options } = interaction;
        const year = options.getInteger("year");
        if (year) {
            const action = await themesData.themes(channel, year)
            interaction.reply({content: `${action}`})
        }
        else {
            const year = new Date().getFullYear();
            const action = await themesData.themes(year)
            interaction.reply({content: `${action}`})
        }
    },
}   