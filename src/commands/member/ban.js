const log = require("../../logger");
const chalk = require("chalk");

module.exports = {
  name: "ban",
  description: "Bans member(s) from the guild.",
  aliases: [],
  usage: "ban <userids/all> [-r]",
  flags: { "-r": "The reason for the ban." },
  run: async function (client, args) {
    const guild = client.target_guild;
    if (args.length < 1) {
      log.error("You must provide at least one member ID");
      return;
    }

    const flags = { "-r": "🧨" };
    let ids = [];
    let bans = 0;

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
      ids = guild.members.cache.map((member) => member.id);
    }

    for (const id of ids) {
      if (!isNaN(id)) {
        try {
          const member = await guild.members.fetch(id.trim());
          await member.ban({ reason: flags["-r"] });

          log.success(
            `${chalk.gray("[")}${chalk.red("-")}${chalk.gray(
              "]"
            )} Banned ${chalk.white("@" + member.user.tag)} from ${chalk.white(
              guild.name
            )}${
              flags["-r"] !== "🧨"
                ? ` with reason ${chalk.white(flags["-r"])}`
                : ""
            }`
          );

          bans++;
        } catch (err) {
          log.error(
            `Failed to ban member with ID ${id.trim()}: ${err}`,
            "src/commands/member/ban.js"
          );
        }
      } else {
        log.error(`Invalid member ID: ${id}`);
      }
    }

    await client.webhook.send({
      username: client.user.tag,
      avatarURL: client.user.avatarURL(),
      content: `\`\`\`ansi\n🧨 Banned members! [2;37m${bans}[0m/[2;37m${ids.length}[0m\n\`\`\``,
    });
  },
};
