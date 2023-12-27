const log = require("../../logger");
const stats = require("../../statistics");
const chalk = require("chalk");

module.exports = {
  name: "directmessage",
  description: "Direct message members from the guild.",
  aliases: ["dm", "privatemessage", "pm"],
  usage: 'directmessage <userids/all/[amount]> -m "[message]" [-s <amount>]',
  flags: {
    "-m": "The message to send.",
    "-s": "The amount of messages to send.",
  },
  run: async function (client, args, flags) {
    const guild = client.target_guild;
    if (args.length < 1) {
      log.error("You must provide at least one member ID");
      return;
    }

    //const flags = { "-m": "" };
    let ids = args;
    let dms = 0;

    // for (let i = 0; i < args.length; i++) {
    //   const arg = args[i];
    //   if (arg.startsWith("-m")) {
    //     flags["-m"] = args[i + 1];
    //     i++;
    //   } else {
    //     ids.push(arg);
    //   }
    // }

    if (flags["m"] === "") {
      log.error("You must provide a message to send.");
      return;
    }

    if (ids[0].toLowerCase() === "all") {
      ids = guild.members.cache.map((member) => member.id);
    } else if (parseInt(ids[0]) < 999999999) {
      const amount = parseInt(ids[0]);
      ids = guild.members.cache.map((member) => member.id);
      ids = ids.sort(() => Math.random() - 0.5);
      ids = ids.slice(0, amount);
    }

    for (
      var i = 0;
      i < (parseInt(flags["s"]) ? parseInt(flags["s"]) : 1);
      i++
    ) {
      for (const id of ids) {
        if (!isNaN(id)) {
          try {
            const member = await guild.members.fetch(id.trim());
            await member.send(flags["m"]);
            log.success(
              `${chalk.gray("[")}${chalk.red("-")}${chalk.gray("]")} Send ${
                flags["-m"]
              } to ${chalk.white("@" + member.user.tag)} from ${chalk.white(
                guild.name
              )}`
            );

            dms++;
          } catch (err) {
            log.error(
              `Failed to send direct message to member with ID ${id.trim()}: ${err}`,
              "src/commands/member/ban.js"
            );
          }
        } else {
          log.error(`Invalid member ID: ${id}`);
        }
      }
    }

    stats.dms(dms, guild);
    await client.webhook.send({
      username: client.user.tag,
      avatarURL: client.user.avatarURL(),
      content: `\`\`\`ansi\n🧨 Send direct message to members! [2;37m${dms}[0m/[2;37m${ids.length}[0m\n\`\`\``,
    });
  },
};
