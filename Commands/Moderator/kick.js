const {
  SlashCommandBuilder,
  CommandInteraction,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Allows user to kick a player")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Select who to kick")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for kick")
        .setRequired(false)
    ).addAttachmentOption,
  async execute(interaction) {
    const { channel, options } = interaction;
    const target = options.getUser("target");
    const reason = options.getString("reason");

    if (!reason) {
        const guildMembers = interaction.guild.members.cache.fetch()
        console.log(guildMembers)
    }

    // interaction.reply({content: `This command is not ready yet, nice try!`, ephemeral: true})
  },
};
