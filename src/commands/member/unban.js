const log = require("../../logger");
const chalk = require("chalk");

module.exports = {
  name: "unban",
  description: "Unbans a member from the guild.",
  aliases: [],
  usage: "unban <userids/all>",
  flags: {},
  run: async function (client, args) {
    const guild = client.target_guild;
    if (args.length < 1) {
      log.error("You must provide a member ID");
      return;
    }

    var ids = args;
    if (ids[0].toLowerCase() === "all") {
      ids = await guild.bans.fetch();
      ids = ids.map((member) => member.user.id);
    } // [2;32m+[0m

    var unbans = 0;
    await client.webhook.send({
      username: client.user.tag,
      avatarURL: client.user.avatarURL(),
      content: `\`\`\`ansi\n🧨 Unbanning members...\n\`\`\``,
    });

    for (const id of ids) {
      try {
        const member = await guild.members.unban(id.trim());
        log.success(
          `${chalk.gray("[")}${chalk.green("+")}${chalk.gray(
            "]"
          )} Unbanned ${chalk.white(member.tag)} from ${chalk.white(
            guild.name
          )}`
        );

        unbans++;
        await client.webhook.send({
          username: client.user.tag,
          avatarURL: client.user.avatarURL(),
          content: `\`\`\`ansi\n[[2;32m+[0m][0;2m Unbanned [0;37m@${member.tag}[0m from [0;37m${guild.name}[0m [2;37m${unbans}[0m/[2;37m${ids.length}[0m[0m\n\`\`\``,
        });
      } catch (err) {
        log.error(err, "src/commands/member/unban.js");
      }
    }

    await client.webhook.send({
      username: client.user.tag,
      avatarURL: client.user.avatarURL(),
      content: `\`\`\`ansi\n🧨 Unbanned members! [2;37m${unbans}[0m/[2;37m${ids.length}[0m\n\`\`\``,
    });
  },
};
