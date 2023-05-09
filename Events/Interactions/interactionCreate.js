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
            console.log("made it to the button")
        } else if (interaction.isStringSelectMenu()) {

            




            // console.log("Made it to string select")
            // console.log(interaction)
            // const command = interaction.client.commands.get(interaction.commandName);

            // if (!command) {
            //     interaction.reply({content: "Outdated command"});
            // }
            // try {
            //     command.execute(interaction, client);
            // } catch (error) {
            //     console.error(`Error executing ${interaction.commandName}`);
			// 	console.error(error);
            // }
        } else {
            return;
        }
        
    },
};

