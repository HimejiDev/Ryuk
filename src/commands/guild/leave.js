const log = require("../../logger");
const stats = require("../../statistics");
const chalk = require("chalk");

module.exports = {
  name: "leave",
  description: "Leaves the current guild.",
  aliases: [],
  usage: "leave",
  flags: {},
  run: async function (client, args, flags) {
    const guild = client.target_guild;

    const confirm = log.input(
      `Are you sure you want to leave ${chalk.white(guild.name)}? (y/n)`,
      client
    );
    if (!["y", "yes"].includes(confirm.toLowerCase())) {
      return log.info("Cancelled leaving guild");
    }

    await guild
      .leave()
      .then((guild) => log.success(`Left guild ${chalk.white(guild.name)}`))
      .catch((err) => log.error(err, "src/commands/server/send.js"));
  },
};
