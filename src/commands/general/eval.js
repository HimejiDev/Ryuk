const log = require("../../logger");
const chalk = require("chalk");

module.exports = {
  name: "eval",
  description: "Evaluate code",
  aliases: [],
  usage: "eval <code>",
  flags: {},
  run: async function (client, args, flags) {
    const variabele = await eval(args.join(" "));
    variabele ? log.info(chalk.greenBright(`[EVAL] ${variabele}`)) : undefined;
  },
};
