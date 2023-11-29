const log = require("../../logger");
const chalk = require("chalk");

module.exports = {
  name: "reload",
  description: "Reloads the guild.",
  aliases: [],
  usage: "reload",
  flags: {},
  run: async function (client, args) {
    try {
      const GUILD_ID = client.INFO[1] || client.target_guild.id;
      client.target_guild = client.guilds.cache.get(GUILD_ID);

      log.success(`Reloaded guild ${chalk.white(client.target_guild.name)}`);
    } catch (err) {
      log.error(
        `Failed to reload guild: ${err}`,
        "src/commands/general/reload.js"
      );
      return;
    }
  },
};
