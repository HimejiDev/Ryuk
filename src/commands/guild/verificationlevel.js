const log = require("../../logger");
const chalk = require("chalk");

module.exports = {
  name: "verificationlevel",
  description: "Controls the Guild's Verification Level.",
  aliases: ["vl"],
  usage: "verificationlevel [disabled|low|medium|high|veryhigh]",
  flags: {},
  run: async function (client, args, flags) {
    const guild = client.target_guild;
    const options = {
      disabled: 0,
      low: 1,
      medium: 2,
      high: 3,
      veryhigh: 4,
    };

    if (args.length > 0 && options[args[0].toLowerCase()] !== undefined) {
      await guild
        .setVerificationLevel(options[args[0].toLowerCase()])
        .then((updated) =>
          log.success(
            `Changed guild verification level: ${
              updated.verificationLevel === 0
                ? chalk.white("None")
                : updated.verificationLevel === 1
                ? chalk.white("Low")
                : updated.verificationLevel === 2
                ? chalk.white("Medium")
                : updated.verificationLevel === 3
                ? chalk.white("High")
                : chalk.white("Very High")
            }`
          )
        )
        .catch((err) =>
          log.error(
            `Failed to change guild verification level | ${err}`,
            "src/commands/guild/verificationlevel.js"
          )
        );
    } else {
      log.success(
        `Current guild verification level: ${
          guild.verificationLevel === 0
            ? chalk.white("None")
            : guild.verificationLevel === 1
            ? chalk.white("Low")
            : guild.verificationLevel === 2
            ? chalk.white("Medium")
            : guild.verificationLevel === 3
            ? chalk.white("High")
            : chalk.white("Very High")
        }`
      );
    }
  },
};
