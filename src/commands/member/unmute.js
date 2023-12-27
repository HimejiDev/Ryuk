const log = require("../../logger");
const chalk = require("chalk");

module.exports = {
  name: "unmute",
  description: "Mutes member(s) in the guild.",
  aliases: ["rtimeout", "rmute"],
  usage: "unmute <userids/all/[amount]> [-r]",
  flags: {
    "-r": "The reason for the mute.",
  },
  run: async function (client, args, flags) {
    const guild = client.target_guild;
    if (args.length < 1) {
      log.error("You must provide at least one member ID");
      return;
    }

    // const flags = {
    //   "-r": "🧨",
    // };

    let ids = args;
    let unmutes = 0;

    // for (let i = 0; i < args.length; i++) {
    //   const arg = args[i];
    //   if (arg.startsWith("-r")) {
    //     flags["-r"] = args[i + 1];
    //     i++;
    //   } else {
    //     ids.push(arg);
    //   }
    // }

    if (ids[0].toLowerCase() === "all") {
      ids = guild.members.cache.map((member) => member.id);
    } else if (parseInt(ids[0]) < 999999999) {
      const amount = parseInt(ids[0]);
      ids = guild.members.cache.map((member) => member.id);
      ids = ids.sort(() => Math.random() - 0.5);
      ids = ids.slice(0, amount);
    }

    for (const id of ids) {
      if (!isNaN(id)) {
        try {
          const member = await guild.members.fetch(id);
          await member.timeout(null, `${flags["r"]} ; 🧨`);

          log.success(
            `${chalk.gray("[")}${chalk.red("-")}${chalk.gray(
              "]"
            )} Unmuted ${chalk.white("@" + member.user.tag)} in ${chalk.white(
              guild.name
            )}${flags["r"] ? ` with reason ${chalk.white(flags["r"])}` : ""}`
          );

          unmutes++;
        } catch (err) {
          log.error(
            `Failed to unmute member with ID ${id}: ${err}`,
            "src/commands/member/mute.js"
          );
        }
      } else {
        log.error(`Invalid member ID: ${id}`);
      }
    }

    await client.webhook.send({
      username: client.user.tag,
      avatarURL: client.user.avatarURL(),
      content: `\`\`\`ansi\n🧨 Unmuted members! [2;37m${unmutes}[0m/[2;37m${ids.length}[0m\n\`\`\``,
    });
  },
};
