const log = require("../../logger");
const chalk = require("chalk");

module.exports = {
  name: "welcomescreen",
  description: "Controls the Guild's welcome screen.",
  aliases: ["ws"],
  usage:
    'welcomescreen <enabled/disabled> [-d "<description>"] [-c "<channelid> <description>"]',
  flags: { "-d": "Description of the welcome screen." },
  run: async function (client, args, flags) {
    const guild = client.target_guild;

    if (args.length > 0) {
      await guild.editWelcomeScreen({
        description: flags["d"] || "",
        enabled: args[0] === "enabled" ? true : false,
        welcomeChannels: [
          {
            channel: flags["c"].split(" ")[0],
            description: flags["c"].slice(1),
          },
        ],
      });
      const welcomescreen = await guild.fetchWelcomeScreen();
      log.success(`Welcome screen updated.`);
      log.success(
        `Status: ${
          welcomescreen.enabled
            ? chalk.white("ENABLED")
            : chalk.white("DISABLED")
        }.`
      );
      log.success(`Description: ${chalk.white(welcomescreen.description)}`);
      welcomescreen.welcomeChannels.forEach((channel) => {
        log.success(`Channel: ${chalk.white("#" + channel.channel.name)}`);
        log.success(`> Description: ${chalk.white(channel.description)}`);
      });
    } else {
      const welcomescreen = await guild.fetchWelcomeScreen();
      log.success(
        `Status: ${
          welcomescreen.enabled
            ? chalk.white("ENABLED")
            : chalk.white("DISABLED")
        }.`
      );
      log.success(`Description: ${chalk.white(welcomescreen.description)}`);
      welcomescreen.welcomeChannels.forEach((channel) => {
        log.success(`Channel: ${chalk.white("#" + channel.channel.name)}`);
        log.success(`> Description: ${chalk.white(channel.description)}`);
      });
    }
  },
};
