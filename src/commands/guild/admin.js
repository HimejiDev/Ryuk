const log = require("../../logger");
const chalk = require("chalk");
const stats = require("../../statistics");
const { PermissionsBitField } = require("discord.js");

module.exports = {
  name: "admin",
  description: "Assigns/gives admin role",
  aliases: ["op"],
  usage: "admin <userids/all/[amount]>",
  flags: {},
  run: async function (client, args, flags) {
    const guild = client.target_guild;
    if (args.length < 1) {
      log.error("You must provide at least one user ID");
      return;
    }

    let assignments = 0;
    let ids = args;
    if (ids[0].toLowerCase() === "all") {
      ids = guild.members.cache.map((role) => role.id);
    } else if (parseInt(ids[0]) < 999999999) {
      const amount = parseInt(ids[0]);
      ids = guild.members.cache.map((role) => role.id);
      ids = ids.sort(() => Math.random() - 0.5);
      ids = ids.slice(0, amount);
    }

    const client_user = await guild.members.fetch(client.user.id);
    var role = undefined;
    await guild.roles.cache
      .map((role) => role)
      .forEach((found_role) => {
        if (
          found_role.permissions.has(PermissionsBitField.Flags.Administrator) &&
          found_role.position < client_user.roles.highest.position
        ) {
          role = found_role;
        }
      });
    if (!role) {
      log.info(`No admin role found in ${guild.name}, creating one...`);
      await guild.roles
        .create({
          name: "Admin",
          permissions: [PermissionsBitField.Flags.Administrator],
          reason: "🧨",
          position: client_user.roles.highest.position,
        })
        .then((new_role) => {
          log.success(
            `Created role ${chalk.white(new_role.name)} | ${chalk.white(
              new_role.id
            )}`
          );
          role = new_role;
        })
        .catch((err) => {
          log.error(`Failed to create role: ${err}`);
          return;
        });
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
