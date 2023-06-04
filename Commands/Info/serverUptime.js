const { SlashCommandBuilder } = require("discord.js");
const client = require("../../index");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("uptime")
    .setDescription("Shows the uptime of the server"),

  async execute(interaction) {
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
