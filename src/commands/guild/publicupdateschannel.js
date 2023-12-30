const log = require("../../logger");
const chalk = require("chalk");

module.exports = {
  name: "publicupdateschannel",
  description: "Controls the public updates channel.",
  aliases: ["puc", "publicupdates"],
  usage: "publicupdateschannel [<channelid>|none]",
  flags: {},
  run: async function (client, args, flags) {
    const guild = client.target_guild;

    if (args.length > 0) {
      await guild
        .setPublicUpdatesChannel(args[0] === "none" ? null : args[0])
        .then((updated) =>
          log.success(
            `Changed public updates channel: ${chalk.white(
              updated.publicUpdatesChannel?.name || "None"
            )}`
          )
        )
        .catch((err) => log.error(err));
    } else {
      log.success(
        `Current public updates channel: ${chalk.white(
          guild.publicUpdatesChannel?.name || "None"
        )}`
      );
    }
  },
};
