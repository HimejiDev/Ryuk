const log = require("../../logger");
const chalk = require("chalk");

module.exports = {
  name: "clear",
  description: "Clears the terminal.",
  aliases: ["cls"],
  usage: "clear",
  flags: {},
  run: async function (client, args, flags) {
    console.clear();
    log.error(
      `by @himeji. ${chalk.white(">>")} https://himeji.dev/ ${chalk.white(
        ">>"
      )} https://discord.gg/49rUCrxda9\n`
    );
  },
};
