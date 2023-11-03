const log = require("../../logger");
const chalk = require("chalk");

module.exports = {
  name: "unban",
  description: "Unbans a member from the guild.",
  aliases: [],
  usage: "unban <userid>",
  run: async function (client, args) {
    const guild = client.target_guild;
    if (args.length < 1) {
      log.error("You must provide a member ID");
      return;
    }

    const id = args[0];
    await guild.members
      .unban(id)
      .then((user) =>
        log.success(
          `${chalk.gray("[")}${chalk.green("+")}${chalk.gray(
            "]"
          )} Unbanned ${chalk.white(user.tag)} from ${chalk.white(guild.name)}`
        )
      )
      .catch((err) => log.error(err, "src/commands/member/ban.js"));
  },
};
