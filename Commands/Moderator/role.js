const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("role")
    .setDescription("Add or remove roles from users")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Add a role to a user")
        .addUserOption((option) =>
          option.setName("target").setDescription("Select who to add a role to.").setRequired(true)
        )
        .addRoleOption((option) =>
          option.setName("role").setDescription("Choose which role to add to the user").setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Remove a role to a user")
        .addUserOption((option) =>
          option.setName("target").setDescription("Select who to remove a role from.").setRequired(true)
        )
        .addRoleOption((option) =>
          option.setName("role").setDescription("Choose which role to remove from the user").setRequired(true)
        )
    ),
  async execute(interaction) {
    const { options } = interaction;
    const target = options.getUser("target");
    const role = options.getRole("role");
    const subcommands = options.getSubcommand();

    switch (subcommands) {
      case "add":
        try {
          const guildMember = await interaction.member.guild.members.fetch(target.id);
          await guildMember.roles.add(role.id);

          const embed = new EmbedBuilder().setDescription(`Successfully added the role ${role} to user: ${target}`);
          return interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
          console.log(error);
        }
      case "remove":
        try {
          const guildMember = await interaction.member.guild.members.fetch(target.id);
          if (guildMember.roles.cache.has(role.id)) {
            await guildMember.roles.remove(role.id);

            const embed = new EmbedBuilder().setDescription(`Successfully removed the role ${role} to user: ${target}`);
            return interaction.reply({ embeds: [embed], ephemeral: true });
          } else {
            const embed = new EmbedBuilder().setDescription(`This user does not have the role ${role}`).setColor("Red");
            return interaction.reply({ embeds: [embed], ephemeral: true });
          }
        } catch (error) {
          console.log(error);
        }
    }
  },
};
