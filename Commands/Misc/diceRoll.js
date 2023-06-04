const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roll")
    .setDescription("Roll a dice")
    .addIntegerOption((option) =>
      option.setName("sides").setDescription("The number of sides, default is 6").setRequired(false)
    ),

  async execute(interaction) {
    const { options } = interaction;
    const sides = options.getInteger("sides") || 6;

    const roll = Math.floor(Math.random() * sides) + 1;
    await interaction.reply({
      content: `${roll}`,
      ephemeral: true,
    });
  },
};
