const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Allows user to kick a player")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption((option) => option.setName("target").setDescription("Select who to kick").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("Reason for kick").setRequired(false)),
  async execute(interaction) {
    const { channel, options } = interaction;
    const target = options.getUser("target");
    const reason = options.getString("reason");

    const guildMember = await interaction.member.guild.members.fetch(target.id);

    if (guildMember.roles.highest.position >= interaction.member.roles.highest.position) {
      const errEmbed = new EmbedBuilder().setDescription(
        `You cannot kick ${target.username} because their role is the same or higher than you.`
      );

      interaction.reply({ embeds: [errEmbed], ephemeral: true });
    } else {
      try {
        await guildMember.kick(reason);

        const embed = new EmbedBuilder().setDescription(
          `${target.username} has been successfully kicked for reason: ${reason}`
        );

        interaction.reply({ embeds: [embed], ephemeral: true });
      } catch (error) {
        interaction.reply({ content: `Sorry there was an error completing your kick request`, ephemeral: true });
      }
    }
  },
};
