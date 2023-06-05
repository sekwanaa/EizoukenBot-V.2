const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("membercount")
    .setDescription("Shows the amount of members in the server."),

  async execute(interaction) {
    const { guild } = interaction;
    const memberCount = guild.memberCount;
    await interaction.reply({
      content: `There are ${memberCount} members in this server.`,
      ephemeral: true,
    });
  },
};
