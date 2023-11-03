const log = require("../../logger");
const chalk = require("chalk");
const { ActivityType } = require("discord.js");

module.exports = {
  name: "status",
  description: "Shows and changes the bot's status.",
  aliases: [],
  usage: "status [status]",
  run: async function (client, args) {
    if (args.length > 0) {
      await client.user
        .setPresence({
          status: "idle",
          activities: [
            {
              type: ActivityType.Custom,
              name: "customstatus",
              state: args.join(" "),
            },
          ],
        })
        .then(() => {
          log.success(
            `Changed status: ${chalk.cyan(
              client.user.presence.activities[0].state
            )}`
          );
        });
    } else {
      log.success(
        `Current status: ${chalk.cyan(
          client.user.presence.activities[0].state
        )}`
      );
    }
  },
};
