const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Allows user to ban a player")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((option) => option.setName("target").setDescription("Select who to ban").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("Reason for ban").setRequired(false)),
  async execute(interaction) {
    const { options } = interaction;
    const target = options.getUser("target");
    const reason = options.getString("reason");

    const guildMember = await interaction.member.guild.members.fetch(target.id);

    if (guildMember.roles.highest.position >= interaction.member.roles.highest.position) {
      const errEmbed = new EmbedBuilder().setDescription(
        `You cannot ban ${target.username} because their role is the same or higher than you.`
      );

      interaction.reply({ embeds: [errEmbed], ephemeral: true });
    } else {
      try {
        await guildMember.ban({reason});

        const embed = new EmbedBuilder().setDescription(
          `${target.username} has been successfully banned for reason: ${reason}`
        ).setTimestamp();

        interaction.reply({ embeds: [embed], ephemeral: true });
      } catch (error) {
        console.log(error);
        interaction.reply({ content: `Sorry there was an error completing your ban request`, ephemeral: true });
      }
    }
  },
};
