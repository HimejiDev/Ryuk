const log = require("../../logger");

module.exports = {
  name: "description",
  description: "Controls the Guild's name.",
  aliases: [],
  usage: "description [description]",
  flags: {},
  run: async function (client, args, flags) {
    const guild = client.target_guild;

    if (args.length > 0) {
      const description = args.join(" ");
      await guild
        .edit({
          description: description,
        })
        .then((updated) =>
          log.success(`Changed guild description: ${updated.description}`)
        )
        .catch((err) => log.error(err));
    } else {
      log.success(`Current guild description: ${guild.description}`);
    }
  },
};
