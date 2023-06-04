const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("randomcolor")
    .setDescription("Generates a random hex color with a preview"),

  async execute(interaction) {
    const color = Math.floor(Math.random() * 16777215).toString(16);
    const embed = new EmbedBuilder().setColor(color);
    await interaction.reply({ embeds: [embed] });
  },
};
