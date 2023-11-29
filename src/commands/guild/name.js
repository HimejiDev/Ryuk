const log = require("../../logger");

module.exports = {
  name: "name",
  description: "Changes/Shows the Guild's name.",
  aliases: [],
  usage: "name [name]",
  flags: {},
  run: async function (client, args) {
    const guild = client.target_guild;

    if (args.length > 0) {
      const name = args.join(" ");
      await guild
        .setName(name)
        .then((updated) => log.success(`Changed guild name: ${updated.name}`))
        .catch((err) => log.error(err));
    } else {
      log.success(`Current guild name: ${guild.name}`);
    }
  },
};
