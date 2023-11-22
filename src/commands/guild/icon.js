const log = require("../../logger");

module.exports = {
  name: "icon",
  description: "Changes/Shows the Guild's icon.",
  aliases: [],
  usage: "icon [url]",
  run: async function (client, args) {
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