const log = require("../../logger");
const chalk = require("chalk");

module.exports = {
  name: "explicitcontentfilter",
  description: "Controls the Guild's Explicit Content Filter Settings.",
  aliases: ["ecf", "contentfilter", "cf"],
  usage: "explicitcontentfilter [all|disabled|noroles]",
  flags: {},
  run: async function (client, args, flags) {
    const guild = client.target_guild;
    const options = {
      all: 2,
      disabled: 0,
      noroles: 1,
    };

    if (args.length > 0 && options[args[0].toLowerCase()] !== undefined) {
      await guild
        .setExplicitContentFilter(options[args[0].toLowerCase()])
        .then((updated) =>
          log.success(
            `Changed guild explicit content filter settings: ${
              updated.explicitContentFilter === 2
                ? chalk.white("All Members")
                : updated.explicitContentFilter === 1
                ? chalk.white("Members without Roles")
                : chalk.white("Disabled")
            }`
          )
        )
        .catch((err) => log.error(err));
    } else {
      log.success(
        `Current guild explicit content filter settings: ${
          guild.explicitContentFilter === 2
            ? chalk.white("All Members")
            : guild.explicitContentFilter === 1
            ? chalk.white("Members without Roles")
            : chalk.white("Disabled")
        }`
      );
    }
  },
};
