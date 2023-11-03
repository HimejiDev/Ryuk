const log = require("../logger");
const fs = require("fs");

module.exports = (client) => {
  fs.readdirSync("./src/commands").forEach((dir) => {
    const files = fs
      .readdirSync(`./src/commands/${dir}`)
      .filter((file) => file.endsWith(".js"));
    if (!files || files.length <= 0) {
      return;
    }

    files.forEach((file) => {
      var command = require(`../commands/${dir}/${file}`);
      if (command) {
        checkCommandConflicts(command.name, command.aliases, client);
        client.commands.set(command.name, command);
        if (command.aliases && Array.isArray(command.aliases)) {
          command.aliases.forEach((alias) => {
            client.aliases.set(alias, command.name);
          });
        }
      } else {
        log.warning(`Command: ${file} not loaded.`);
      }
    });
  });

  log.info("Commands loaded.");
};

function checkCommandConflicts(name, aliases, client) {
  // Check if the name of the command already exists
  const existingCommand = client.commands.find(
    (command) => command.name === name
  );
  if (existingCommand) {
    log.warning(
      `Command: ${name} already exist. >>> ${existingCommand.usage} : ${existingCommand.description}`
    );
    return true;
  }

  // Check if the name of the command exists as an alias
  const existingAliasCommandName = client.aliases.get(name);
  if (existingAliasCommandName) {
    log.warning(
      `Command: ${name} already exist as an alias. >>> ${
        client.commands.get(existingAliasCommandName).usage
      } : ${client.commands.get(existingAliasCommandName).description}`
    );
    return true;
  }

  // Check if any alias of the new command conflicts with existing commands
  for (const alias of aliases) {
    const conflictingCommand = client.commands.find(
      (command) => command.name === alias
    );
    if (conflictingCommand) {
      log.warning(
        `Alias: ${alias} already exist as an command. >>> ${conflictingCommand.usage} : ${conflictingCommand.description}`
      );
      return true;
    }
  }

  return false; // No conflicts were found
}
