const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("uptime")
    .setDescription("Shows the uptime of the server"),

  async execute(interaction, client) {
    try {
      if (client.uptime >= 86_400_000) {
        //more than a day
        interaction.reply({
          content: `Uptime: ${Math.round(client.uptime / 86_400_000)} days`,
          ephemeral: true,
        });
      } else if (client.uptime >= 3_600_000) {
        // more than an hour
        interaction.reply({
          content: `Uptime: ${Math.round(client.uptime / 3600000)} hours`,
          ephemeral: true,
        });
      } else if (client.uptime >= 60_000) {
        // more than a minute
        interaction.reply({
          content: `Uptime: ${Math.round(client.uptime / 60000)} minutes`,
          ephemeral: true,
        });
      } else {
        interaction.reply({
          // less than a minute
          content: `Uptime: ${Math.round(client.uptime / 1000)} seconds`,
          ephemeral: true,
        });
      }
    } catch (e) {
      console.log(e);
    }
  },
};
