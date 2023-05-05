const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits } = require("discord.js");
const themesData = require("../../data/themesData")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Allows user to kick a player")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    ,

    async execute(interaction) {
        interaction.reply({content: `This command is not ready yet, nice try!`, ephemeral: true})
    },
}