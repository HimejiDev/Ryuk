const log = require("../../logger");
const stats = require("../../statistics");
const chalk = require("chalk");

module.exports = {
  name: "mute",
  description: "Mutes member(s) in the guild.",
  aliases: ["timeout"],
  usage: 'mute <userids/all/[amount]> [-r "<reason>"] [-t <time>]',
  flags: {
    "-r": "The reason for the mute.",
    "-t": "The time in seconds (default: 60s).",
  },
  run: async function (client, args, flags) {
    const guild = client.target_guild;
    if (args.length < 1) {
      log.error("You must provide at least one member ID");
      return;
    }

    // const flags = {
    //   "-r": "🧨",
    //   "-t": 60,
    // };

    let ids = args;
    let mutes = 0;

    // for (let i = 0; i < args.length; i++) {
    //   const arg = args[i];
    //   if (arg.startsWith("-r")) {
    //     flags["-r"] = args[i + 1];
    //     i++;
    //   } else if (arg.startsWith("-t")) {
    //     flags["-t"] = parseInt(args[i + 1] > 2419201 ? 2419201 : args[i + 1]);
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

    flags["t"] = parseInt(flags["t"] > 2419200 ? 2419200 : flags["t"]);
    for (const id of ids) {
      if (!isNaN(id)) {
        try {
          const member = await guild.members.fetch(id);
          await member.timeout(flags["t"] * 1000, `${flags["r"]} ; 🧨`);

          log.success(
            `${chalk.gray("[")}${chalk.red("-")}${chalk.gray(
              "]"
            )} Muted ${chalk.white("@" + member.user.tag)} in ${chalk.white(
              guild.name
            )} for ${chalk.white(flags["t"] + " seconds")}${
              flags["r"] ? ` with reason ${chalk.white(flags["r"])}` : ""
            }`
          );

          mutes++;
        } catch (err) {
          log.error(
            `Failed to mute member with ID ${id}: ${err}`,
            "src/commands/member/mute.js"
          );
        }
      } else {
        log.error(`Invalid member ID: ${id}`);
      }
    }

    stats.mutes(mutes, guild);
    await client.webhook.send({
      username: client.user.tag,
      avatarURL: client.user.avatarURL(),
      content: `\`\`\`ansi\n🧨 Muted members! [2;37m${mutes}[0m/[2;37m${ids.length}[0m\n\`\`\``,
    });
  },
};
