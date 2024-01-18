const log = require("../../logger");
const chalk = require("chalk");
const stats = require("../../statistics");

module.exports = {
  name: "createrole",
  description: "Creates role(s)",
  aliases: ["crole", "cr"],
  usage: "createrole [rolename] [-a <amount>] [-c <hexcolor>]",
  flags: { "-a": "Amount of roles to create" },
  run: async function (client, args, flags) {
    const amount = flags["a"] || 1;
    const roleName = args.length >= 1 ? args.join(" ") : "🧨";
    const color = flags["c"] || "Random";
    const guild = client.target_guild;

    let creations = 0;

    for (let i = 0; i < amount; i++) {
      await guild.roles
        .create({
          name: roleName,
          color: color,
          reason: "🧨",
        })
        .then((role) => {
          log.success(`Created role ${chalk.white("@" + role.name)}`);
          creations++;
        })
        .catch((err) => {
          log.error(
            `Failed to create role ${chalk.white("@" + roleName)} | ${err}`
          );
        });
    }

    stats.roles_create(creations, guild);
    await client.webhook.send({
      username: client.user.tag,
      avatarURL: client.user.avatarURL(),
      content: `\`\`\`ansi\n🧨 Created roles! [2;37m${creations}[0m/[2;37m${amount}[0m\n\`\`\``,
    });
  },
};
