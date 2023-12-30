const log = require("../../logger");
const chalk = require("chalk");

module.exports = {
  name: "safetyalertschannel",
  description: "Controls the safety alerts channel.",
  aliases: ["sac", "safetyalrts"],
  usage: "safetyalertschannel [<channelid>|none]",
  flags: {},
  run: async function (client, args, flags) {
    const guild = client.target_guild;

    if (args.length > 0) {
      await guild
        .setSafetyAlertsChannel(args[0] === "none" ? null : args[0])
        .then((updated) =>
          log.success(
            `Changed safety alerts channel: ${chalk.white(
              updated.safetyAlertsChannel?.name || "None"
            )}`
          )
        )
        .catch((err) => log.error(err));
    } else {
      log.success(
        `Current safety alerts channel: ${chalk.white(
          guild.safetyAlertsChannel?.name || "None"
        )}`
      );
    }
  },
};
