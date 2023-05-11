const {
  SlashCommandBuilder,
  EmbedBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  ComponentType,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("help").setDescription("Collection of all commands"),

  async execute(interaction) {
    const { channel, options } = interaction;
    const emojis = {
      info: "📚",
      moderator: "🛠️",
      general: "👪",
      music: "🎵",
      misc: "〽️",
    };

    const directories = [...new Set(interaction.client.commands.map((cmd) => cmd.folder))];

    const formatString = (str) => `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

    const categories = directories.map((dir) => {
      const getCommands = interaction.client.commands
        .filter((cmd) => cmd.folder === dir)
        .map((cmd) => {
          return {
            name: cmd.data.name,
            description: cmd.data.description || "There is no description for this command.",
          };
        });

      return {
        directory: formatString(dir),
        commands: getCommands,
      };
    });

    const embed = new EmbedBuilder().setDescription("Please choose a category from below.");

    const components = (state) => [
      new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("help-menu")
          .setPlaceholder("Please select a category")
          .setDisabled(state)
          .addOptions(
            categories.map((cmd) => {
              return {
                label: cmd.directory,
                value: cmd.directory.toLowerCase(),
                description: `Commands from ${cmd.directory} category`,
                emoji: emojis[cmd.directory.toLowerCase() || null],
              };
            })
          )
      ),
    ];

    const initialMessage = await interaction.reply({
      embeds: [embed],
      components: components(false),
      ephemeral: true,
    });

    const filter = (i) => i.user.id === interaction.member.id;

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      interactionType: 3,
      time: 120000,
    });

    collector.on("collect", async (i) => {
      const [directory] = i.values;
      const category = categories.find((x) => x.directory.toLowerCase() === directory);
      // await i.reply(`${i.user} has selected ${directory}!`);
      const categoryEmbed = new EmbedBuilder()
        .setTitle(`${formatString(directory)} commands`)
        .setDescription(`A list of all commands under the category ${directory}`)
        .addFields(
          category.commands.map((cmd) => {
            return {
              name: `\`${cmd.name}\``,
              value: cmd.description,
              inline: false,
            };
          })
        );
      i.update({ embeds: [categoryEmbed] });
    });
    collector.on("end", () => initialMessage.edit({ components: components(true) }));
  },
};
