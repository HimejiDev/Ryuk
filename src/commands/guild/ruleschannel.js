const log = require("../../logger");
const chalk = require("chalk");

module.exports = {
  name: "ruleschannel",
  description: "Controls the rules channel.",
  aliases: ["rc", "rules"],
  usage: "ruleschannel [<channelid>|none]",
  flags: {},
  run: async function (client, args, flags) {
    const guild = client.target_guild;

    if (args.length > 0) {
      await guild
        .setRulesChannel(args[0] === "none" ? null : args[0])
        .then((updated) =>
          log.success(
            `Changed public updates channel: ${chalk.white(
              updated.rulesChannel?.name || "None"
            )}`
          )
        )
        .catch((err) =>
          log.error(
            `Failed to change rules channel | ${err}`,
            "src/commands/guild/ruleschannel.js"
          )
        );
    } else {
      log.success(
        `Current public updates channel: ${chalk.white(
          guild.rulesChannel?.name || "None"
        )}`
      );
    }
  },
};
