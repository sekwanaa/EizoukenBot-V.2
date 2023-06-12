const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("playing")
    .setDescription("Allows user to see which users are currently playing <argument>")
    .addStringOption((option) =>
      option.setName("activity").setDescription("To see which activity people are playing").setRequired(true)
    ),

  async execute(interaction) {
    const { channel, options } = interaction;
    const activity = options.getString("activity");
    membersPlaying = [];
    const guildMembers = await channel.guild.members.fetch();
    const usersPlayingActivity = guildMembers.forEach((member) => {
      if (member.presence) {
        try {
          if (!member.presence.activities || member.presence.activities.length == 0) {
          } else {
            let userActivity = member.presence.activities[0];
            if (userActivity.name === activity) {
              console.log(member.user.username);
              membersPlaying.push(member.user.username);
            }
          }
        } catch (error) {}
      } else {
        return;
      }
    });
    if (membersPlaying.length >= 1) {
      var joinedMembersPlaying = membersPlaying.join(",\n");
      interaction.reply({ content: `Users:\n\n${joinedMembersPlaying}\n\n are playing ${activity}`, ephemeral: true });
    } else if (membersPlaying.length === 0) {
      interaction.reply({ content: `No one is playing ${activity}`, ephemeral: true });
    } else {
      interaction.reply({ content: `Users:\n\n${membersPlaying}\n\n are playing ${activity}`, ephemeral: true });
    }
  },
};
