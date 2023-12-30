const log = require("../../logger");

module.exports = {
  name: "icon",
  description: "Controls the Guild's icon.",
  aliases: [],
  usage: "icon [url]",
  flags: {},
  run: async function (client, args, flags) {
    const guild = client.target_guild;

    if (args.length > 0) {
      const url = args.join(" ");
      await guild
        .setIcon(url)
        .then((updated) =>
          log.success(`Changed guild icon: ${updated.iconURL()}`)
        )
        .catch((err) => log.error(err));
    } else {
      log.success(`Current guild icon: ${guild.iconURL()}`);
    }
  },
};
