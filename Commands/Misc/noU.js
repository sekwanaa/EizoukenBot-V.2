const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nou")
    .setDescription('Mention the most recent "ur mom" user with the message "no u"'),

  async execute(interaction) {
    const { channel } = interaction;
    const urMomMessage = await channel.messages.fetch().then(messages => messages.filter(msg => msg.author.bot && msg.interaction.commandName === 'urmom').first());
    const previousUser = urMomMessage.interaction.user
    interaction.reply({ content: `${previousUser} no u` });
  },
};
