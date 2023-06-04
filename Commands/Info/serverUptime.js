const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("uptime")
    .setDescription("Shows the uptime of the server"),

  async execute(interaction, client) {
    try {
      interaction.reply({
        content: `Uptime: ${Math.round(client.uptime / 1000)} seconds`,
        ephemeral: true,
      });
    } catch (e) {
      interaction.reply({
        content: e,
        ephemeral: true,
      });
    }
  },
};
