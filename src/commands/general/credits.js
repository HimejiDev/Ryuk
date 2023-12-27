const log = require("../../logger");
const chalk = require("chalk");

module.exports = {
  name: "credits",
  description: "Shows the develoopers of this program.",
  aliases: ["credit", "devs", "creds"],
  usage: "credits",
  flags: {},
  run: async function (client, args, flags) {
    log.success(
      `made by ${chalk.white("@himeji.")}   @ ${chalk.white(
        "https://himeji.dev/"
      )}`
    );
    log.success(
      `${chalk.white("Himeji Development")} @ ${chalk.white(
        "https://discord.gg/49rUCrxda9"
      )}`
    );
  },
};
