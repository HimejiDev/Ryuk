const log = require("./logger");

module.exports = async (client) => {
  const input = log.input();

  const cmd = input.split(" ")[0].toLowerCase();
  const command =
    client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));

  const args = input.split(" ").slice(1);
  if (command) await command.run(client, args);
  else !command && input && log.warning(`Command not found: ${cmd}`);

  require("./terminal")(client);
};
