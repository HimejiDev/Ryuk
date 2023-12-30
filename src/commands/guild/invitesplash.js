const log = require("../../logger");

module.exports = {
  name: "invitesplash",
  description: "Controls the Guild's invite splash.",
  aliases: ["is", "isplash"],
  usage: "invitesplash [url]",
  flags: {},
  run: async function (client, args, flags) {
    const guild = client.target_guild;

    if (args.length > 0) {
      const url = args.join(" ");
      await guild
        .setSplash(url)
        .then((updated) =>
          log.success(`Changed guild invite splash: ${updated.splashURL()}`)
        )
        .catch((err) => log.error(err));
    } else {
      log.success(`Current guild invite splash: ${guild.splashURL()}`);
    }
  },
};
