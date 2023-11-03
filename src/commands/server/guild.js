const log = require("../../logger");
var AsciiTable = require("ascii-table");

module.exports = {
  name: "guild",
  description: "Shows info about the target guild.",
  aliases: ["ginfo"],
  usage: "guild",
  run: async function (client, args) {
    const guild = client.target_guild;

    var table = new AsciiTable("Guild Info");
    table.setBorder("|", "-", "+", "+");

    table.addRow("Name", guild.name);
    table.addRow("ID", guild.id);
    table.addRow("Owner ID", guild.ownerId);

    table.addRow("Members", guild.memberCount);
    table.addRow("Channels", guild.channels.cache.size);
    table.addRow("Roles", guild.roles.cache.size);
    table.addRow("Emojis", guild.emojis.cache.size);
    table.addRow("Stickers", guild.stickers.cache.size);
    table.addRow(
      "Created",
      guild.createdAt.getDate() +
        "/" +
        (guild.createdAt.getMonth() + 1) +
        "/" +
        guild.createdAt.getFullYear()
    );

    table.addRow("Verified", guild.verified);
    table.addRow("Partnered", guild.partnered);

    table
      .toString()
      .split("\n")
      .forEach((line) => {
        log.info(line);
      });
  },
};
