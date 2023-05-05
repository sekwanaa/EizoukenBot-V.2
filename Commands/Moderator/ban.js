const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits } = require("discord.js");
const themesData = require("../../data/themesData")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Allows user to ban a player")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    ,

    async execute(interaction) {
        interaction.reply({content: `This command is not ready yet, nice try!`, ephemeral: true})
    },
}