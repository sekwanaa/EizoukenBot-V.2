function loadCommands(client) {
  const ascii = require("ascii-table");
  const fs = require("fs");

  let commandsArray = [];

  const table = new ascii().setHeading("Commands", "Status");
  const commandFolder = fs.readdirSync("./Commands");
  for (const folder of commandFolder) {
    const commandFiles = fs.readdirSync(`./Commands/${folder}`).filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      if (file == "playing.js") {
        continue;
      }
      const commandFile = require(`../Commands/${folder}/${file}`);

      const properties = { folder, ...commandFile };
      client.commands.set(commandFile.data.name, properties);
      // client.commands.set(commandFile.data.name, commandFile);

      commandsArray.push(commandFile.data.toJSON());

      table.addRow(file, "loaded");
      continue;
    }
  }
  client.application.commands.set(commandsArray);

  return console.log(table.toString(), "\n Loaded Commands");
}

module.exports = { loadCommands };
