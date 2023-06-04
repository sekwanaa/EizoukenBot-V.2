const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("color")
    .setDescription("Generate a color based on a hex code")
    .addStringOption((option) =>
      option.setName("hex").setDescription("Hex code").setRequired(true)
    ),

  async execute(interaction) {
    const { options } = interaction;
    const color = options.getString("hex");
    const embed = new EmbedBuilder().setDescription(color).setColor(color);
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
