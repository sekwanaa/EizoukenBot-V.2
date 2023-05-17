const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nou")
    .setDescription('Mention the most recent "ur mom" user with the message "no u"'),

  async execute(interaction, client) {
    const { channel } = interaction;
    let cooldown = client.cooldowns;
    const cooldownTimer = 15000;
    try {
      if (cooldown.has(interaction.user.id)) {
        const cooldownExpirationTime = cooldown.get(interaction.user.id) + cooldownTimer;
        const timeLeft = cooldownExpirationTime - Date.now()
         if (timeLeft > 0) {
          interaction.reply({ content: `Please wait ${Math.ceil(timeLeft / 1000)} seconds before you use the command again.`, ephemeral: true })
        };
      } else {
        const urMomMessage = await channel.messages
          .fetch()
          .then((messages) =>
            messages.filter((msg) => msg.author.bot && msg.interaction.commandName === "urmom").first()
          );
        const previousUser = urMomMessage.interaction.user;
        interaction.reply({ content: `${previousUser} no u` });

        cooldown.set(interaction.user.id, Date.now());
        setTimeout(() => {
          cooldown.delete(interaction.user.id);
        }, cooldownTimer);
      }
    } catch (e) {
      console.log(e);
      interaction.reply({ content: `There was no one here who used the command /urmom recently`, ephemeral: true });
    }
  },
};
