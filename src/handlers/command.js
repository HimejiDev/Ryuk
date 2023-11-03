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
