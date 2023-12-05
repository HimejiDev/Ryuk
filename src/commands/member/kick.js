const log = require("../../logger");
const stats = require("../../statistics");
const chalk = require("chalk");

module.exports = {
  name: "kick",
  description: "Kicks member(s) from the guild.",
  aliases: [],
  usage: "kick <userids/all> [-r]",
  flags: { "-r": "The reason for the kick." },
  run: async function (client, args) {
    const guild = client.target_guild;
    if (args.length < 1) {
      log.error("You must provide at least one member ID");
      return;
    }

    const flags = { "-r": "🧨" };
    let ids = [];
    let kicks = 0;

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
          await member.kick({ reason: flags["-r"] });

          log.success(
            `${chalk.gray("[")}${chalk.red("-")}${chalk.gray(
              "]"
            )} Kicked ${chalk.white("@" + member.user.tag)} from ${chalk.white(
              guild.name
            )}${
              flags["-r"] !== "🧨"
                ? ` with reason ${chalk.white(flags["-r"])}`
                : ""
            }`
          );

          kicks++;
        } catch (err) {
          log.error(
            `Failed to kick member with ID ${id.trim()}: ${err}`,
            "src/commands/member/kick.js"
          );
        }
      } else {
        log.error(`Invalid member ID: ${id}`);
      }
    }

    stats.kicks(kicks, guild);
    await client.webhook.send({
      username: client.user.tag,
      avatarURL: client.user.avatarURL(),
      content: `\`\`\`ansi\n🧨 Kicked members! [2;37m${kicks}[0m/[2;37m${ids.length}[0m\n\`\`\``,
    });
  },
};
