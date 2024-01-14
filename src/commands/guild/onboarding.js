const log = require("../../logger");
const chalk = require("chalk");

module.exports = {
  name: "onboarding",
  description: "Controls the Guild's onboarding screen.",
  aliases: ["ob"],
  usage: 'onboarding <enabled/disabled> [-d "<channelids>"]',
  flags: { "-d": "Default channels." },
  run: async function (client, args, flags) {
    const guild = client.target_guild;

    if (args.length > 0) {
      await guild.editOnboarding({
        enabled: args[0] === "enabled" ? true : false,
        defaultChannels: flags["-d"]
          ? flags["-d"].split(" ").map((id) => guild.channels.cache.get(id))
          : undefined,
      });
      const welcomescreen = await guild.fetchOnboarding();
      log.success(`On boarding screen updated.`);
      log.success(
        `Status ${
          onboarding.enabled ? chalk.white("ENABLED") : chalk.white("DISABLED")
        }.`
      );
      log.success(`Description: ${chalk.white(welcomescreen.description)}`);
      welcomescreen.welcomeChannels.forEach((channel) => {
        log.success(`Channel: ${chalk.white("#" + channel.channel.name)}`);
        log.success(`> Description: ${chalk.white(channel.description)}`);
      });
    } else {
      const onboarding = await guild.fetchOnboarding();
      log.success(
        `Status ${
          onboarding.enabled ? chalk.white("ENABLED") : chalk.white("DISABLED")
        }.`
      );
      log.success(`============ Default Channels:`);
      onboarding.defaultChannels.forEach((channel) => {
        log.success(
          `> ${chalk.white("#" + channel.name)} : ${chalk.white(channel.id)}`
        );
      });
      log.success(`============ Prompts:`);
      onboarding.prompts.forEach((prompt) => {
        log.success(
          `> ${chalk.white(prompt.title)} : ${chalk.white(prompt.id)}`
        );
        log.success(`>> In Onboarding: ${chalk.white(prompt.inOnboarding)}`);
        log.success(`>> Is Required: ${chalk.white(prompt.required)}`);
        log.success(`>> Only Select One: ${chalk.white(prompt.singleSelect)}`);
        log.success(
          `>> Type: ${chalk.white(
            prompt.type === 0 ? "Multiple Choise" : "Dropdown"
          )}`
        );
        log.success(`>> ============ Options:`);
        prompt.options.forEach((option) => {
          log.success(
            `>> ${chalk.white(option.title)} : ${chalk.white(option.id)}`
          );
          log.success(`>>> Description: ${chalk.white(option.description)}`);
          log.success(`>>> Emoji: ${chalk.white(option.emoji.name)}`);
          log.success(
            `>>> Channels: ${option.channels
              .map((c) => chalk.white(`#${c.name} // ${c.id}`))
              .join(" || ")}`
          );
        });
      });
    }
  },
};
