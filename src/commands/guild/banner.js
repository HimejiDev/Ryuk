const log = require("../../logger");

module.exports = {
  name: "banner",
  description: "Controls the Guild's banner.",
  aliases: [],
  usage: "banner [url]",
  flags: {},
  run: async function (client, args, flags) {
    const guild = client.target_guild;

    if (args.length > 0) {
      const url = args.join(" ");
      await guild
        .setBanner(url)
        .then((updated) =>
          log.success(`Changed guild banner: ${updated.bannerURL()}`)
        )
        .catch((err) => log.error(err));
    } else {
      log.success(`Current guild banner: ${guild.bannerURL()}`);
    }
  },
};
