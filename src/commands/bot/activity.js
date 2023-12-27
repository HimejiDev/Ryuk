const log = require("../../logger");
const chalk = require("chalk");
const { ActivityType } = require("discord.js");

module.exports = {
  name: "activity",
  description: "Shows or changes the bot's activity.",
  aliases: [],
  usage: "activity [type] [state]",
  flags: {},
  run: async function (client, args, flags) {
    if (args.length > 1) {
      var activity = ActivityType.Custom;
      if (args[0].toLowerCase() == "playing") {
        activity = ActivityType.Playing;
      } else if (args[0].toLowerCase() == "streaming") {
        activity = ActivityType.Streaming;
      } else if (args[0].toLowerCase() == "listening") {
        activity = ActivityType.Listening;
      } else if (args[0].toLowerCase() == "watching") {
        activity = ActivityType.Watching;
      } else if (args[0].toLowerCase() == "competing") {
        activity = ActivityType.Competing;
      }

      await client.user.setActivity({
        type: activity,
        name:
          activity !== ActivityType.Custom
            ? args.slice(1).join(" ")
            : "customstatus",
        state: args.slice(1).join(" "),
      });
      log.success(
        `Changed activy: ${chalk.cyan(
          client.user.presence.activities[0].state
        )}`
      );
      log.debug(
        `Activity changes sometimes have trouble updating. It appears to be a visual bug on the client.`
      );
    } else {
      log.success(
        `Current activity: ${chalk.cyan(
          client.user.presence.activities[0].state
        )}`
      );
    }
  },
};
