const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const client = require("../../index");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("music")
    .setDescription("Complete music commands.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("volume")
        .setDescription("Adjust song volume")
        .addIntegerOption((option) =>
          option
            .setName("percent")
            .setDescription("10 = 10%")
            .setMinValue(1)
            .setMaxValue(100)
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    const { options, member, guild, channel } = interaction;
    const volume = options.getInteger("percent");
    const subcommand = options.getSubcommand();
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
      switch (subcommand) {
        case "volume":
          if (!queue) {
            embed.setColor("Red").setDescription("Sorry, there is no queue");
            return interaction.reply({ embeds: [embed], ephemeral: true });
          }
          client.distube.setVolume(voiceChannel, volume);
          return interaction.reply({
            content: `Volume set to ${volume}%`,
            ephemeral: true,
          });
      }
    } catch (error) {
      console.log(error);
      interaction.reply({
        content: "sorry something went wrong with your request",
        ephermeral: true,
      });
    }
  },
};
