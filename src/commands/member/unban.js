const log = require("../../logger");
const chalk = require("chalk");

module.exports = {
  name: "unban",
  description: "Unbans a member from the guild.",
  aliases: [],
  usage: "unban <userids/all> [-r]",
  flags: { "-r": "The reason for the unban." },
  run: async function (client, args) {
    const guild = client.target_guild;
    if (args.length < 1) {
      log.error("You must provide a member ID");
      return;
    }

    var unbans = 0;
    var ids = args;
    const reasonIndex = args.findIndex((arg) => arg.toLowerCase() === "-r");
    var ids = reasonIndex === -1 ? args : args.slice(0, reasonIndex);
    if (ids[0].toLowerCase() === "all") {
      ids = await guild.bans.fetch();
      ids = ids.map((member) => member.user.id);
    }
    let reason =
      reasonIndex !== -1 ? args.slice(reasonIndex + 1).join(" ") : "";
    reason = reason ? `${reason} ; 🧨` : "🧨";

    for (const id of ids) {
      try {
        await guild.bans
          .remove(id.trim())
          .then((user) => {
            const reasonLog =
              reason !== "🧨"
                ? ` with reason ${chalk.white(reason.replace(" ; 🧨", ""))}`
                : "";

            log.success(
              `${chalk.gray("[")}${chalk.green("+")}${chalk.gray(
                "]"
              )} Unbanned ${chalk.white(user.tag)} from ${chalk.white(
                guild.name
              )}${reasonLog}`
            );
            unbans++;
          })
          .catch((err) =>
            log.error(
              `Failed to ban member with ID ${id.trim()}: ${err}`,
              "src/commands/member/unban.js"
            )
          );
      } catch (err) {
        log.error(
          `Failed to ban member with ID ${id.trim()}: ${err}`,
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
