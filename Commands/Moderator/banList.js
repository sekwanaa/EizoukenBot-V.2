const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("banlist")
    .setDescription("Displays a list of banned users"),

  async execute(interaction) {
    const { guild } = interaction;
    try {
      const banlist = await guild.bans.fetch();
      if (banlist.size === 0) {
        await interaction.reply({
          content: "No banned users found",
          ephemeral: true,
        });
        return;
      }
      const bannedUsers = banlist.map((bannedUser) => {
        return {
          username: bannedUser.user.username,
          id: bannedUser.user.id,
        };
      });
      const embed = new EmbedBuilder().setDescription(`**${bannedUsers.length}** banned users`);
      bannedUsers.forEach((user) => {
        embed.addFields(
          { name: "Username", value: user.username, inline: true },
          { name: "ID", value: user.id, inline: true }
        );
      });
      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.log(error);
    }
  },
};
