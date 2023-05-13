const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("urmom").setDescription('Mention the user above with the message "ur mom"'),

  async execute(interaction) {
    const { channel } = interaction;
    const previousUser = await channel.messages.fetch({ limit: 1 }).then((msg) => msg.map((user) => user.author));
    interaction.reply({ content: `${previousUser} ur mom` });
  },
};
