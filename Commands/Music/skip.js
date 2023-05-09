const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const client = require("../../index");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips current song"),

  async execute(interaction) {
    const { member, guild } = interaction;
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
        embed.setColor("Red").setDescription("Sorry, there is no queue");
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }
      await queue.skip(voiceChannel);
      embed.setColor("Purple").setDescription("⏭️ | Skipped the current song!");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.log(error);
      interaction.reply({
        content: "sorry something went wrong with your request",
        ephermeral: true,
      });
    }
  },
};
