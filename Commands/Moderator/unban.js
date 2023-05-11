const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const themesData = require("../../data/themesData");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Allows user to unban a player")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((option) =>
      option.setName("userid").setDescription("Input userId of user to unban").setRequired(true)
    ),
  async execute(interaction) {
    const { options } = interaction;
    const userId = options.getUser("userid");

    try {
      await interaction.guild.members.unban(userId);

      const embed = new EmbedBuilder().setDescription(`${userId} has been successfully unbanned.`).setTimestamp();

      interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      interaction.reply({ content: `Sorry there was an error completing your unban request`, ephemeral: true });
    }
  },
};
