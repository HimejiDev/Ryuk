const log = require("../../logger");
const chalk = require("chalk");

module.exports = {
  name: "clear",
  description: "Clears the terminal.",
  aliases: ["cls"],
  usage: "clear",
  run: async function (client, args) {
    console.clear();
    log.error(`by @himeji. ${chalk.white(">>")} https://himeji.dev/\n`);
  },
};
