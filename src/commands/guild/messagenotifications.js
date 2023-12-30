const log = require("../../logger");
const chalk = require("chalk");

module.exports = {
  name: "messagenotifications",
  description: "Controls the Guild's Default Message Notifactions Settings.",
  aliases: ["mn"],
  usage: "messagenotifications [all|mentions]",
  flags: {},
  run: async function (client, args, flags) {
    const guild = client.target_guild;

    if (args.length > 0 && (args[0] === "all" || args[0] === "mentions")) {
      await guild
        .setDefaultMessageNotifications(args[0] === "all" ? 0 : 1)
        .then((updated) =>
          log.success(
            `Changed guild default notifications settings: ${
              updated.defaultMessageNotifications === 0
                ? chalk.white("All Messages")
                : chalk.white("Only @mentions")
            }`
          )
        )
        .catch((err) => log.error(err));
    } else {
      log.success(
        `Current guild default notifications settings: ${
          guild.defaultMessageNotifications === 0
            ? chalk.white("All Messages")
            : chalk.white("Only @mentions")
        }`
      );
    }
  },
};
