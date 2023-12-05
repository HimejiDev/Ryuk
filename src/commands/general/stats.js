const log = require("../../logger");
const stats = require("../../statistics");
const chalk = require("chalk");
var AsciiTable = require("ascii-table");

module.exports = {
  name: "statistics",
  description: "Get statistics about the bot.",
  aliases: ["stats"],
  usage: "statistics [guild_id]",
  flags: {},
  run: async function (client, args) {
    let guild_id = undefined;

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (arg.startsWith("-t")) {
        flags["-t"] = args[i + 1];
        i++;
      } else {
        guild_id = arg;
      }
    }

    const table = new AsciiTable().setBorder("|", "-", "+", "+");
    if (guild_id !== undefined) {
      const guild = stats.guild(guild_id);

      table.setTitle(`${guild.name} Statistics`);
      table.setHeading("Type", "Value");
      table.addRow("ID", guild.id);
      table.addRow("Bans", guild.actions.bans);
      table.addRow("Kicks", guild.actions.kicks);
      table.addRow("Mutes", guild.actions.mutes);
      table.addRow("Nukes", guild.actions.nukes);
      table.addRow("Current Memebers", guild.members);
      table.addRow("Max Memebers", guild.max.members);
    } else {
      table.setTitle(`Statistics`);
      table.setHeading("Type", "Value");
      table.addRow("Guilds", stats.get("guilds").length);
      table.addRow("Bans", stats.get("bans"));
      table.addRow("Kicks", stats.get("kicks"));
      table.addRow("Mutes", stats.get("mutes"));
      table.addRow("Nukes", stats.get("nukes"));
    }

    const rows = table.toString().split("\n");
    for (let i = 0; i < rows.length; i++) {
      log.info(rows[i]);
    }
  },
};
