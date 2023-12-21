const log = require("../../logger");
const chalk = require("chalk");
const { ActivityType } = require("discord.js");

module.exports = {
  name: "status",
  description: "Shows or changes the bot's status.",
  aliases: [],
  usage: "status [status]",
  flags: {},
  run: async function (client, args) {
    if (args.length > 0) {
      await client.user.setStatus(args[0].toLowerCase());
      log.success(`Changed status: ${chalk.cyan(client.user.presence.status)}`);
      log.debug(
        `Status changes sometimes have trouble updating. It appears to be a visual bug on the client.`
      );
    } else {
      log.success(`Current status: ${chalk.cyan(client.user.presence.status)}`);
    }
  },
};
