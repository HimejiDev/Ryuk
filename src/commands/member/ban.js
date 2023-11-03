const log = require("../../logger");
const chalk = require("chalk");

module.exports = {
  name: "ban",
  description: "Bans a member from the guild.",
  aliases: [],
  usage: "ban <userid> [reason]",
  run: async function (client, args) {
    const guild = client.target_guild;
    if (args.length < 1) {
      log.error("You must provide a member ID");
      return;
    }

    const id = args[0];
    const member = await guild.members.fetch(id);
    if (!member) {
      log.error("Member not found");
      return;
    }

    const reason = args.slice(1).join(" ");

    await member
      .ban({ reason: reason })
      .then((banned) =>
        log.success(
          `${chalk.gray("[")}${chalk.red("-")}${chalk.gray(
            "]"
          )} Banned ${chalk.white(banned.user.tag)} from ${chalk.white(
            guild.name
          )}`
        )
      )
      .catch((err) => log.error(err, "src/commands/member/ban.js"));
  },
};
