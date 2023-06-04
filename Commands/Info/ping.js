const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Pong! Tests response time of the bot"),

  execute(interaction) {
    const responseTime = interaction.createdTimestamp - Date.now();

    interaction.reply({ content: `Pong! \nResponse time: ${responseTime}ms`, ephemeral: true });
  },
};
