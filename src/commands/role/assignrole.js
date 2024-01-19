const log = require("../../logger");
const chalk = require("chalk");
const stats = require("../../statistics");

module.exports = {
  name: "assignrole",
  description: "Assign role(s)",
  aliases: ["arole", "ar"],
  usage: "assignrole <roleid> <userids/all/[amount]>",
  flags: {},
  run: async function (client, args, flags) {
    const guild = client.target_guild;
    if (args.length < 2) {
      log.error("You must provide at least one role and user ID");
      return;
    }

    let assignments = 0;
    let ids = args.slice(1);
    if (ids[0].toLowerCase() === "all") {
      ids = guild.members.cache.map((role) => role.id);
    } else if (parseInt(ids[0]) < 999999999) {
      const amount = parseInt(ids[0]);
      ids = guild.members.cache.map((role) => role.id);
      ids = ids.sort(() => Math.random() - 0.5);
      ids = ids.slice(0, amount);
    }

    const role = await guild.roles.fetch(args[0]);
    if (!role) {
      log.error(`Invalid role ID: ${args[0]}`);
      return;
    }

    for (const id of ids) {
      if (!isNaN(id)) {
        const member = await guild.members.fetch(id.trim());
        await member.roles
          .add(role, "🧨")
          .then((member) => {
            log.success(
              `Assigned role ${chalk.white(role.name)} | ${chalk.white(
                role.id
              )} to ${chalk.white(member.user.tag)} | ${chalk.white(
                member.user.id
              )}`
            );
            assignments++;
          })
          .catch((err) => {
            log.error(
              `Failed to assign role ${chalk.white(role.name)} | ${chalk.white(
                role.id
              )} to ${chalk.white(member.user.tag)} | ${chalk.white(
                member.user.id
              )} | ${err}`
            );
          });
      } else {
        log.error(`Invalid user ID: ${id}`);
      }
    }

    stats.roles_assigned(assignments, guild);
    await client.webhook.send({
      username: client.user.tag,
      avatarURL: client.user.avatarURL(),
      content: `\`\`\`ansi\n🧨 Assigned roles! [2;37m${assignments}[0m/[2;37m${ids.length}[0m\n\`\`\``,
    });
  },
};
