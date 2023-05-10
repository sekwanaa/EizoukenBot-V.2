const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Pong"),

  execute(interaction) {
    interaction.reply({ content: "Pong", ephemeral: true });
  },
};
