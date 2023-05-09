const { CommandInteraction } = require("discord.js");

module.exports = {
    name: "interactionCreate",

    execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                interaction.reply({content: "Outdated command"});
            }
            try {
                command.execute(interaction, client);
            } catch (error) {
                console.error(`Error executing ${interaction.commandName}`);
				console.error(error);
            }
        } else if (interaction.isButton()) {
        } else if (interaction.isStringSelectMenu()) {
        } else {
            return;
        }
        
    },
};

