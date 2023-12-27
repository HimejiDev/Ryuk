const log = require("../../logger");
const fs = require("fs");
var AsciiTable = require("ascii-table");

module.exports = {
  name: "help",
  description: "Shows all the commands.",
  aliases: ["h"],
  usage: "help [category]",
  flags: {},
  run: async function (client, args, flags) {
    var tables = [];
    const folders = fs.readdirSync(`./src/commands`);
    const category = args[0] ? args[0] : "general";

    if (folders.includes(category)) {
      var table = new AsciiTable(`${capitalize(category)} Commands`);
      table
        .setHeading("Name", "Description", "Usage", "Flags", "Aliases")
        .setBorder("|", "-", "+", "+");

      fs.readdirSync(`./src/commands/${category}`).forEach((cmd) => {
        const command = require(`../${category}/${cmd}`);
        table.addRow(
          command.name,
          command.description,
          command.usage,
          command.flags
            ? Object.keys(command.flags)
                .map((flag) => `${flag}: ${command.flags[flag]}`)
                .join(", ")
            : "",
          command.aliases.join(", ")
        );
      });

      table
        .toString()
        .split("\n")
        .forEach((line) => {
          log.info(line);
        });

      var lastRow = table.toString().split("\n").slice(-1)[0];
      var commandLength = "| <command> <arguments> <flags> |".length;
      var spacesNeeded = lastRow.length - commandLength;
      var spaces = " ".repeat(spacesNeeded > 0 ? spacesNeeded : 0);

      log.info(`| <command> <arguments> <flags> ${spaces}|`);
      log.info(table.toString().split("\n").slice(-1)[0]);
    } else {
      log.error("Invalid category");
    }

    commandLength = `| Categories: ${folders
      .map((folder) => folder)
      .join(", ")} |`.length;
    spacesNeeded = lastRow.length - commandLength;
    spaces = " ".repeat(spacesNeeded > 0 ? spacesNeeded : 0);
    log.info(
      `| Categories: ${folders.map((folder) => folder).join(", ")} ${spaces}|`
    );
    log.info(table.toString().split("\n").slice(-1)[0]);
  },
};

function capitalize([first = "", ...rest]) {
  return [first.toUpperCase(), ...rest].join("");
}
