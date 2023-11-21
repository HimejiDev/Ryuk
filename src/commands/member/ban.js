const log = require("../../logger");
const chalk = require("chalk");

module.exports = {
  name: "ban",
  description: "Bans member(s) from the guild.",
  aliases: [],
  usage: "ban <userids/all>",
  flags: { "--reason": "The reason for the ban." },
  run: async function (client, args) {
    const guild = client.target_guild;
    if (args.length < 1) {
      log.error("You must provide at least one member ID");
      return;
    }

    const ids = args[0].split(",");
    const reasonIndex = args.findIndex(
      (arg) => arg.toLowerCase() === "--reason"
    );
    let reason = "";

    if (reasonIndex !== -1) {
      reason = args.slice(reasonIndex + 1).join(" ");
    }

    for (const id of ids) {
      const member = await guild.members.fetch(id.trim()).catch(() => null);
      if (!member) {
        log.error(`Member with ID ${id.trim()} not found`);
        continue;
      }

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
    }
  },
};
