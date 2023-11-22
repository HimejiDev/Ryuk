const { EmbedBuilder } = require("discord.js");
const log = require("../../logger");
const chalk = require("chalk");

module.exports = {
  name: "ban",
  description: "Bans member(s) from the guild.",
  aliases: [],
  usage: "ban <userids/all> [-r reason]",
  flags: { "-r": "The reason for the ban." },
  run: async function (client, args) {
    const guild = client.target_guild;
    if (args.length < 1) {
      log.error("You must provide at least one member ID");
      return;
    }

    const reasonIndex = args.findIndex((arg) => arg.toLowerCase() === "-r");
    var ids = reasonIndex === -1 ? args : args.slice(0, reasonIndex);
    if (ids[0].toLowerCase() === "all") {
      ids = guild.members.cache.map((member) => member.id);
    }
    let reason =
      reasonIndex !== -1 ? args.slice(reasonIndex + 1).join(" ") : "";

    reason = reason ? `${reason} ; 🧨` : "🧨";

    var bans = 0;
    await client.webhook.send({
      username: client.user.tag,
      avatarURL: client.user.avatarURL(),
      content: `\`\`\`ansi\n🧨 Banning members...\n\`\`\``,
    });

    for (const id of ids) {
      try {
        const member = await guild.members.fetch(id.trim());
        await member.ban({ reason: reason });

        // Log success message
        const reasonLog =
          reason !== "🧨"
            ? ` with reason ${chalk.white(reason.replace(" ; 🧨", ""))}`
            : "";
        log.success(
          `${chalk.gray("[")}${chalk.red("-")}${chalk.gray(
            "]"
          )} Banned ${chalk.white("@" + member.user.tag)} from ${chalk.white(
            guild.name
          )}${reasonLog}`
        );
        // edit webhook message
        bans++;
        await client.webhook.send({
          username: client.user.tag,
          avatarURL: client.user.avatarURL(),
          content: `\`\`\`ansi\n[[2;31m-[0m][0;2m Banned [0;37m@${member.user.tag}[0m from [0;37m${
            guild.name
          }[0m ${
            reason !== "🧨" ? " with reason [0;37m" + reason.replace(" ; 🧨", "") : ""
          }[0m. [2;37m${bans}[0m/[2;37m${ids.length}[0m[0m\n\`\`\``,
        });
      } catch (err) {
        log.error(
          `Failed to ban member with ID ${id.trim()}: ${err}`,
          "src/commands/member/ban.js"
        );
      }
    }

    await client.webhook.send({
      username: client.user.tag,
      avatarURL: client.user.avatarURL(),
      content: `\`\`\`ansi\n🧨 Banned members! [2;37m${bans}[0m/[2;37m${ids.length}[0m\n\`\`\``,
    });
  },
};
