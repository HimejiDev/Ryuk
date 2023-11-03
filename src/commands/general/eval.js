const log = require("../../logger");

module.exports = {
  name: "eval",
  description: "Evaluate code",
  aliases: [],
  usage: "eval <code>",
  run: async function (client, args) {
    eval(args.join(" "));
  },
};
