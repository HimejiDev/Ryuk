const log = require("../../logger");
const chalk = require("chalk");
var AsciiTable = require("ascii-table");

module.exports = {
  name: "guilds",
  description: "Lists all guilds the bot is in.",
  aliases: [],
  usage: "guilds",
  flags: {},
  run: async function (client, args, flags) {
    const guilds = await client.guilds.cache.map((guild) => guild);

    const table = new AsciiTable().setBorder("|", "-", "+", "+");
    table.setHeading("Name", "ID", "Members", "Owner", "Owner ID");

    for (const guild of guilds) {
      const guild_owner = await guild.fetchOwner();
      table.addRow(
        guild.name,
        guild.id,
        guild.memberCount,
        guild_owner.user.tag,
        guild_owner.id
      );
    }

    const rows = table.toString().split("\n");
    for (let i = 0; i < rows.length; i++) {
      log.info(rows[i]);
    }
  },
};
