const log = require("../../logger");
const chalk = require("chalk");
const stats = require("../../statistics");

module.exports = {
  name: "deleterole",
  description: "Deletes role(s)",
  aliases: ["drole", "dr"],
  usage: "deleterole <roleids/all/[amount]>",
  flags: {},
  run: async function (client, args, flags) {
    const guild = client.target_guild;
    if (args.length < 1) {
      log.error("You must provide at least one role ID");
      return;
    }

    let deletions = 0;
    let ids = args;
    if (ids[0].toLowerCase() === "all") {
      ids = guild.roles.cache.map((role) => role.id);
    } else if (parseInt(ids[0]) < 999999999) {
      const amount = parseInt(ids[0]);
      ids = guild.roles.cache.map((role) => role.id);
      ids = ids.sort(() => Math.random() - 0.5);
      ids = ids.slice(0, amount);
    }

    for (const id of ids) {
      if (!isNaN(id)) {
        const role = await guild.roles.fetch(id);
        await role
          .delete("🧨")
          .then((c) => {
            log.success(
              `Deleted role ${chalk.white("@" + role.name)} | ${chalk.white(
                id
              )}`
            );
            deletions++;
          })
          .catch((err) => {
            log.error(
              `Failed to delete role ${chalk.white(id)} | ${err}`,
              "src/commands/role/deleterole.js"
            );
          });
      } else {
        log.error(`Invalid role ID: ${id}`);
      }
    }

    stats.roles_delete(deletions, guild);
    await client.webhook.send({
      username: client.user.tag,
      avatarURL: client.user.avatarURL(),
      content: `\`\`\`ansi\n🧨 Deleted roles! [2;37m${deletions}[0m/[2;37m${ids.length}[0m\n\`\`\``,
    });
  },
};
