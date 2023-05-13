const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nou")
    .setDescription('Mention the user with the message "no u"')
    .addUserOption((option) => option.setName("target").setDescription("Select a user to mention").setRequired(true)),

  async execute(interaction) {
    const { options } = interaction;
    const target = options.getUser("target")
    interaction.reply({ content: `${target} no u` });
  },
};
