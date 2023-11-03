const log = require("../../logger");

module.exports = {
  name: "credits",
  description: "Shows the develoopers of this program.",
  aliases: [],
  usage: "credits",
  run: async function (client, args) {
    log.success(`This bot was made by @himeji. >> https://himeji.dev/`);
    log.success(
      `Inspirations: Infamous Koala @ https://www.youtube.com/@InfamousKoala`
    );
  },
};
