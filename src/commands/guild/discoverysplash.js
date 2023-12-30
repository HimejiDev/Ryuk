const log = require("../../logger");

module.exports = {
  name: "discoverysplash",
  description: "Controls the Guild's discovery splash.",
  aliases: ["ds", "dsplash"],
  usage: "discoverysplash [url]",
  flags: {},
  run: async function (client, args, flags) {
    const guild = client.target_guild;

    if (args.length > 0) {
      const url = args.join(" ");
      await guild
        .setDiscoverySplash(url)
        .then((updated) =>
          log.success(
            `Changed guild discovery splash: ${updated.discoverySplashURL()}`
          )
        )
        .catch((err) => log.error(err));
    } else {
      log.success(
        `Current guild discovery splash: ${guild.discoverySplashURL()}`
      );
    }
  },
};
