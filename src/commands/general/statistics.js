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
    let guild_id = args.length > 0 ? args[0] : undefined;

    const table = new AsciiTable().setBorder("|", "-", "+", "+");
    if (guild_id !== undefined && guild_id !== "guilds") {
      const guild = stats.guild(guild_id);

      table.setTitle(`${guild.name} Statistics`);
      table.setHeading("Type", "Value");
      table.addRow("ID", guild.id);
      table.addRow("Messages", guild.actionsmessages);
      table.addRow("Bans", guild.actions.bans);
      table.addRow("Kicks", guild.actions.kicks);
      table.addRow("Mutes", guild.actions.mutes);
      table.addRow("Nukes", guild.actions.nukes);
      table.addRow("Current Memebers", guild.members);
      table.addRow("Max Memebers", guild.max.members);
    } else if (guild_id === "guilds") {
      table.setHeading("ID", "Name", "Members");
      for (const guild of stats.guilds()) {
        table.addRow(guild.id, guild.name, guild.members);
      }
    } else {
      table.setTitle(`Statistics`);
      table.setHeading("Type", "Value");
      table.addRow("Guilds", stats.guilds().length);
      table.addRow("Messages", stats.get("messages"));
      table.addRow("Bans", stats.get("bans"));
      table.addRow("Kicks", stats.get("kicks"));
      table.addRow("Mutes", stats.get("mutes"));
      table.addRow("Nukes", stats.get("nukes"));
    }

    await client.webhook.send({
      username: `${client.user.username} Statistics`,
      avatarURL: client.user.avatarURL(),
      content: `\`\`\`ansi\n${table.toString()}\`\`\``,
    });

    const rows = table.toString().split("\n");
    for (let i = 0; i < rows.length; i++) {
      log.info(rows[i]);
    }
  },
};
