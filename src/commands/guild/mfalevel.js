const log = require("../../logger");
const chalk = require("chalk");

module.exports = {
  name: "mfalevel",
  description: "Controls the Guild's MFA Level.",
  aliases: ["mfal", "mfa"],
  usage: "mfalevel [on|off]",
  flags: {},
  run: async function (client, args, flags) {
    const guild = client.target_guild;

    if (args.length > 0 && (args[0] === "on" || args[0] === "off")) {
      await guild
        .setMFALevel(args[0] === "off" ? 0 : 1)
        .then((updated) =>
          log.success(
            `Changed guild MFA level: ${
              updated.mfaLevel === 0 ? chalk.white("Off") : chalk.white("On")
            }`
          )
        )
        .catch((err) => log.error(err));
    } else {
      log.success(
        `Current guild MFA level: ${
          guild.mfaLevel === 0 ? chalk.white("Off") : chalk.white("On")
        }`
      );
    }
  },
};
