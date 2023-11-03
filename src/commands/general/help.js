const log = require("../../logger");
const fs = require("fs");
var AsciiTable = require("ascii-table");

module.exports = {
  name: "help",
  description: "Shows all the commands.",
  aliases: ["h"],
  usage: "help [category]",
  run: async function (client, args) {
    var tables = [];
    const folders = fs.readdirSync(`./src/commands`);
    const category = args[0] ? args[0] : "general";

    if (folders.includes(category)) {
      var table = new AsciiTable(/*`${capitalize(category)} Commands`*/);
      table
        .setHeading("Name", "Description", "Usage", "Aliases")
        .setBorder("|", "-", "+", "+");

      fs.readdirSync(`./src/commands/${category}`).forEach((cmd) => {
        const command = require(`../${category}/${cmd}`);
        table.addRow(
          command.name,
          command.description,
          command.usage,
          command.aliases.join(", ")
        );
      });

      table
        .toString()
        .split("\n")
        .forEach((line) => {
          log.info(line);
        });
    } else {
      log.error("Invalid category");
    }

    log.info(
      `Categories: ${folders.map((folder) => capitalize(folder)).join(", ")}`
    );
  },
};

function capitalize([first = "", ...rest]) {
  return [first.toUpperCase(), ...rest].join("");
}
