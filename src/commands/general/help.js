const log = require("../../logger");
const fs = require("fs");
var AsciiTable = require("ascii-table");

module.exports = {
  name: "help",
  description: "Shows all the commands.",
  aliases: ["h"],
  usage: "help [category] [-u] [-a] [-f]",
  flags: {},
  run: async function (client, args, flags) {
    console.log(flags);
    var tables = [];
    const folders = fs.readdirSync(`./src/commands`);
    const category = args[0] ? args[0] : "general";

    if (folders.includes(category)) {
      const views = [flags["u"], flags["a"], flags["f"]];
      console.log(views);

      var table = new AsciiTable(`${capitalize(category)} Commands`);
      table
        .setHeading(
          "Name",
          "Description",
          flags["u"] ? "Usage" : null,
          flags["f"] ? "Flags" : null,
          flags["a"] ? "Aliases" : null
        )
        .setBorder("|", "-", "+", "+");

      fs.readdirSync(`./src/commands/${category}`).forEach((cmd) => {
        const command = require(`../${category}/${cmd}`);
        table.addRow(
          command.name,
          command.description,
          flags["u"] ? command.usage : null,
          flags["f"]
            ? command.flags
              ? Object.keys(command.flags)
                  .map((flag) => `${flag}: ${command.flags[flag]}`)
                  .join(", ")
              : ""
            : null,
          flags["a"] ? command.aliases.join(", ") : null
        );
      });

      table
        .toString()
        .split("\n")
        .forEach((line) => {
          log.info(line);
        });

      var lastRow = table.toString().split("\n").slice(-1)[0];
      var commandLength = "| <> = required, [] = optional |".length;
      var spacesNeeded = lastRow.length - commandLength;
      var spaces = " ".repeat(spacesNeeded > 0 ? spacesNeeded : 0);

      log.info(`| <> = required, [] = optional ${spaces}|`);
      //log.info(table.toString().split("\n").slice(-1)[0]);

      commandLength = `| -u = usage, -f = falgs, -a = aliases |`.length;
      spacesNeeded = lastRow.length - commandLength;
      spaces = " ".repeat(spacesNeeded > 0 ? spacesNeeded : 0);

      log.info(`| -u = usage, -f = falgs, -a = aliases ${spaces}|`);

      commandLength = `| Categories: ${folders
        .map((folder) => folder)
        .join(", ")} |`.length;
      spacesNeeded = lastRow.length - commandLength;
      spaces = " ".repeat(spacesNeeded > 0 ? spacesNeeded : 0);
      log.info(
        `| Categories: ${folders.map((folder) => folder).join(", ")} ${spaces}|`
      );
      log.info(table.toString().split("\n").slice(-1)[0]);
    } else {
      log.error("Invalid category");
    }
  },
};

function capitalize([first = "", ...rest]) {
  return [first.toUpperCase(), ...rest].join("");
}
