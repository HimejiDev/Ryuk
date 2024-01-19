const log = require("../../logger");
const chalk = require("chalk");
const stats = require("../../statistics");

module.exports = {
  name: "removerole",
  description: "Removes role(s)",
  aliases: ["rrole", "rr"],
  usage: "removerole <userid> <roleids/all/[amount]>",
  flags: {},
  run: async function (client, args, flags) {
    const guild = client.target_guild;
    if (args.length < 2) {
      log.error("You must provide at least one user and role ID");
      return;
    }

    const member = await guild.members.fetch(args[0]);
    if (!member) {
      log.error(`Invalid user ID: ${args[0]}`);
      return;
    }

    let removed = 0;
    let ids = args.slice(1);
    if (ids[0].toLowerCase() === "all") {
      ids = member.roles.cache.map((role) => role.id);
    } else if (parseInt(ids[0]) < 999999999) {
      const amount = parseInt(ids[0]);
      ids = member.roles.cache.map((role) => role.id);
      ids = ids.sort(() => Math.random() - 0.5);
      ids = ids.slice(0, amount);
    }

    for (const id of ids) {
      if (!isNaN(id)) {
        const role = await guild.roles.fetch(id.trim());
        await member.roles
          .remove(role, "🧨")
          .then((member) => {
            log.success(
              `Removed role ${chalk.white(role.name)} | ${chalk.white(
                role.id
              )} from ${chalk.white(member.user.tag)} | ${chalk.white(
                member.user.id
              )}`
            );
            removed++;
          })
          .catch((err) => {
            log.error(
              `Failed to remove role ${chalk.white(role.name)} | ${chalk.white(
                role.id
              )} from ${chalk.white(member.user.tag)} | ${chalk.white(
                member.user.id
              )} | ${err}`
            );
          });
      } else {
        log.error(`Invalid user ID: ${id}`);
      }
    }

    stats.roles_removed(removed, guild);
    await client.webhook.send({
      username: client.user.tag,
      avatarURL: client.user.avatarURL(),
      content: `\`\`\`ansi\n🧨 Removed roles! [2;37m${removed}[0m/[2;37m${ids.length}[0m\n\`\`\``,
    });
  },
};
