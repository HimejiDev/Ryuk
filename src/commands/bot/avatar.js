const log = require("../../logger");
const chalk = require("chalk");

module.exports = {
  name: "avatar",
  description: "Change or shows the bot's avatar.",
  aliases: [],
  usage: "avatar [url]",
  flags: {},
  run: async function (client, args) {
    const url = args.join(" ");
    if (!url)
      return log.success(
        `Current avatar: ${chalk.cyan(client.user.avatarURL())}`
      );
    await client.user
      .setAvatar(url)
      .then((user) => log.success(`Changed avatar to ${user.avatarURL()}`))
      .catch((err) => log.error(err, "src/commands/bot/avatar.js"));
  },
};
