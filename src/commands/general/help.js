const log = require("../../logger");
const fs = require("fs");
var AsciiTable = require("ascii-table");

module.exports = {
  name: "help",
  description: "Shows all the commands.",
  aliases: ["h"],
  usage: "help [category]",
  flags: {},
  run: async function (client, args) {
    var tables = [];
    const folders = fs.readdirSync(`./src/commands`);
    const category = args[0] ? args[0] : "general";

    if (folders.includes(category)) {
      var table = new AsciiTable(/*`${capitalize(category)} Commands`*/);
      table
        .setHeading("Name", "Description", "Usage", "Flags", "Aliases")
        .setBorder("|", "-", "+", "+");

      fs.readdirSync(`./src/commands/${category}`).forEach((cmd) => {
        const command = require(`../${category}/${cmd}`);
        // format flags: [flag]: [description] (e.g. -r: The reason for the ban.) devide by comma
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
