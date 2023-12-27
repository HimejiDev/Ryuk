const log = require("../../logger");
var AsciiTable = require("ascii-table");

module.exports = {
  name: "user",
  description: "Shows info about the current user.",
  aliases: ["info", "uinfo"],
  usage: "user",
  flags: {},
  run: async function (client, args, flags) {
    var table = new AsciiTable("User Info");
    table.setBorder("|", "-", "+", "+");

    table.addRow("Tag", client.user.tag);
    table.addRow("ID", client.user.id);
    table.addRow("Bot", client.user.bot);
    table.addRow(
      "Created",
      client.user.createdAt.getDate() +
        "/" +
        (client.user.createdAt.getMonth() + 1) +
        "/" +
        client.user.createdAt.getFullYear()
    );

    table.addRow("Verified", client.user.verified);

    table
      .toString()
      .split("\n")
      .forEach((line) => {
        log.info(line);
      });
  },
};
