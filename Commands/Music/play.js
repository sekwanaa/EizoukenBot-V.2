const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const client = require("../../index");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription(
      "Plays a song or adds it to the queue if there is a song currently playing"
    )
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Song name or url.")
        .setRequired(true)
    ),

  async execute(interaction) {
    const { options, member, guild, channel } = interaction;
    const query = options.getString("query");
    const voiceChannel = member.voice.channel;

    const embed = new EmbedBuilder();

    if (!voiceChannel) {
      embed
        .setColor("Red")
        .setDescription(
          "You need to be in a voice channel to execute music commands."
        );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    if (!member.voice.channel == guild.members.me.voice.channelId) {
      embed
        .setColor("Red")
        .setDescription("I can only be used in one channel at a time.");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    const queue = await client.distube.getQueue(voiceChannel);
    try {
      if (!queue) {
        client.distube.play(voiceChannel, query, {
          textChannel: channel,
          member: member,
        });
        return interaction.reply({
          content: `🎶 Request received`,
          ephemeral: true,
        });
      }
      client.distube.play(voiceChannel, query, {
        textChannel: channel,
        member: member,
      });
      return interaction.reply({
        content: `🎶 Request received`,
        ephemeral: true,
      });
    } catch (error) {
      console.log(error);
      interaction.reply({
        content: "sorry something went wrong with your request",
        ephermeral: true,
      });
    }
  },
};
