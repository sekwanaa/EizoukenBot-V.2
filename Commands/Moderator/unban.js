const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const themesData = require("../../data/themesData");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Allows user to unban a player")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((option) => option.setName("target").setDescription("Choose who to unban").setRequired(true)),
  async execute(interaction) {
    const { guild, options } = interaction;
    const user = options.getUser("target");
    const bannedUsers = await guild.bans.fetch();
    const bannedUsersId = bannedUsers.map((users) => users.user.id);

    if (bannedUsersId.includes(user.id)) {
      try {
        await interaction.guild.members.unban(user);

        const embed = new EmbedBuilder().setDescription(`${user} has been successfully unbanned.`).setTimestamp();

        interaction.reply({ embeds: [embed], ephemeral: true });
      } catch (error) {
        interaction.reply({ content: `Sorry there was an error completing your unban request`, ephemeral: true });
      }
    } else {
      const errEmbed = new EmbedBuilder().setDescription(`${user} is not currently banned.`).setColor("Red");
      interaction.reply({ embeds: [errEmbed], ephemeral: true });
    }
  },
};
