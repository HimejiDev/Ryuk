const log = require("../../logger");
const chalk = require("chalk");

module.exports = {
  name: "unban",
  description: "Unbans a member from the guild.",
  aliases: ["rban"],
  usage: "unban <userids/all/[amount]> [-r]",
  flags: { "-r": "The reason for the unban." },
  run: async function (client, args) {
    const guild = client.target_guild;
    if (args.length < 1) {
      log.error("You must provide a member ID");
      return;
    }

    const flags = { "-r": "🧨" };
    let unbans = 0;
    let ids = args;

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (arg.startsWith("-r")) {
        flags["-r"] = args[i + 1];
        i++;
      } else {
        ids.push(arg);
      }
    }

    if (ids[0].toLowerCase() === "all") {
      const bannedUsers = await guild.bans.fetch();
      ids = bannedUsers.map((banInfo) => banInfo.user.id);
    } else if (parseInt(ids[0]) < 999999999) {
      const amount = parseInt(ids[0]);
      ids = bannedUsers.map((banInfo) => banInfo.user.id);
      ids = ids.sort(() => Math.random() - 0.5);
      ids = ids.slice(0, amount);
    }

    for (const id of ids) {
      try {
        await guild.bans
          .remove(id.trim())
          .then((user) => {
            log.success(
              `${chalk.gray("[")}${chalk.green("+")}${chalk.gray(
                "]"
              )} Unbanned ${chalk.white(user.tag)} from ${chalk.white(
                guild.name
              )}${
                flags["-r"] !== "🧨"
                  ? ` with reason ${chalk.white(flags["-r"])}`
                  : ""
              }`
            );
            unbans++;
          })
          .catch((err) =>
            log.error(
              `Failed to unban member with ID ${id.trim()}: ${err}`,
              "src/commands/member/unban.js"
            )
          );
      } catch (err) {
        log.error(
          `Failed to unban member with ID ${id.trim()}: ${err}`,
          "src/commands/member/unban.js"
        );
      }
    }

    await client.webhook.send({
      username: client.user.tag,
      avatarURL: client.user.avatarURL(),
      content: `\`\`\`ansi\n🧨 Unbanned members! [2;37m${unbans}[0m/[2;37m${ids.length}[0m\n\`\`\``,
    });
  },
};
