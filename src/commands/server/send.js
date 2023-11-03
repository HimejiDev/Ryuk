const log = require("../../logger");
const chalk = require("chalk");

module.exports = {
  name: "send",
  description: "Sends a message to the guild.",
  aliases: [],
  usage: "send <channelid> <message>",
  run: async function (client, args) {
    const guild = client.target_guild;
    if (args.length < 1) {
      log.error("You must provide a channel ID");
      return;
    }

    const id = args[0];
    const channel = await guild.channels.fetch(id);
    if (!channel) {
      log.error("Channel not found");
      return;
    }

    const message = args.slice(1).join(" ");
    if (!message) {
      log.error("You must provide a message");
      return;
    }

    await channel
      .send(message)
      .then(() =>
        log.success(
          `${chalk.gray("[")}${chalk.green("+")}${chalk.gray(
            "]"
          )} Send message in #${chalk.white(channel.name)} > ${chalk.white(
            message
          )}`
        )
      )
      .catch((err) => log.error(err, "src/commands/server/send.js"));
  },
};
