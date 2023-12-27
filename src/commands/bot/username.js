const log = require("../../logger");
const chalk = require("chalk");

module.exports = {
  name: "username",
  description: "Change or shows the bot's username.",
  aliases: [],
  usage: "username [name]",
  flags: {},
  run: async function (client, args, flags) {
    const name = args.join(" ");
    if (!name)
      return log.success(
        `Current username: ${chalk.cyan(client.user.username)}`
      );
    await client.user
      .setUsername(name)
      .then((user) => log.success(`Changed username to ${user.username}`))
      .catch((err) => log.error(err, "src/commands/bot/username.js"));
  },
};
