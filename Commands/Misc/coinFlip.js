const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("flip").setDescription("Flips a coin"),

  async execute(interaction) {
    const flip = Math.round(Math.random() + 1);
    flip == 1
      ? await interaction.reply({ content: "Heads", ephemeral: true })
      : await interaction.reply({ content: "Tails", ephemeral: true });
  },
};
