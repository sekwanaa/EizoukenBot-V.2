const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const themesData = require("../../data/themesData")


module.exports = {
    data: new SlashCommandBuilder()
    .setName("suggest")
    .setDescription("Allows user to suggest a feature for the server")
    .addStringOption(option => 
        option.setName("name")
        .setDescription("Name your suggestion")
        .setRequired(true)
    )
    .addStringOption(option => 
        option.setName("description")
        .setDescription("Describe your suggestion")
        .setRequired(true)
    ),

    async execute(interaction) {
        const { guild, member, options } = interaction;
        const name = options.getString("name");
        const description = options.getString("description");
        
        const embed = new EmbedBuilder()
        .setColor("Green")
        .setDescription(`A suggestion made by: ${member}`)
        .addFields(
            {name: "Suggestion", value: `${name}`},
            {name: "Description", value: `${description}`}
        )
        .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL({dynamic: true})})

        await guild.channels.cache.get("1105713324773097522").send({embeds: [embed]}).then( s => {
            s.react("✔️");
            s.react("❌");
        });

        interaction.reply({content: `Your suggestion has been added to the channel #feature-suggestion`, ephemeral: true});
    },
}   