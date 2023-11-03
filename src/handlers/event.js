const fs = require("fs");
const log = require("../logger");

module.exports = (client) => {
  fs.readdirSync(`./src/events`)
    .filter((file) => file.endsWith(".js"))
    .forEach((eventFile) => {
      const event = require(`../events/${eventFile}`);
      if (!event) {
        log.warning(`Event: ${eventFile} not loaded.`);
      }
    });
  log.info("Events loaded.");
};
