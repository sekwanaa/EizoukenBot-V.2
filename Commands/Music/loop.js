const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const client = require("../../index");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Loop current song or current queue")
    .addStringOption((options) =>
      options
        .setName("options")
        .setDescription("Loop options: off, song, queue")
        .addChoices({ name: "off", value: "off" }, { name: "song", value: "song" }, { name: "queue", value: "queue" })
        .setRequired(true)
    ),

  async execute(interaction) {
    const { options, member, guild } = interaction;
    const option = options.getString("options");
    const voiceChannel = member.voice.channel;

    const embed = new EmbedBuilder();

    if (!voiceChannel) {
      embed.setColor("Red").setDescription("You need to be in a voice channel to execute music commands.");
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    if (!member.voice.channel == guild.members.me.voice.channelId) {
      embed.setColor("Red").setDescription("I can only be used in one channel at a time.");
      return interaction.reply({ embeds: [embed] });
    }
    const queue = await client.distube.getQueue(voiceChannel);
    let mode = null;
    try {
      if (!queue) {
        embed.setColor("Red").setDescription("Sorry, there is no queue");
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      switch (option) {
        case "off":
          mode = 0;
          break;
        case "song":
          mode = 1;
          break;
        case "queue":
          mode = 2;
          break;
      }

      await queue.setRepeatMode(mode);

      mode = mode ? (mode === 2 ? "Repeat Queue" : "Repeat Song") : "Off";
      embed.setColor("Orange").setDescription(`🔁 | Repeat mode to \`${mode}\`.`);
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
