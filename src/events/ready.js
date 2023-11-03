const { ActivityType, WebhookClient } = require("discord.js");
const client = require("../bot");
const log = require("../logger");
const chalk = require("chalk");

client.on("ready", async () => {
  client.user.setPresence({
    status: "idle",
    activities: [
      {
        type: ActivityType.Custom,
        name: "customstatus",
        state: "🎈",
      },
    ],
  });

  log.info(
    `Logged in as ${chalk.cyan(client.user.tag)}. [${chalk.cyan(
      client.user.id
    )}]`
  );

  const webhook = new WebhookClient({
    url: "https://discord.com/api/webhooks/1169266922626490479/uW_LM8vS-ZF0RcrXzc0oE-xB5AAHOsKCv8H-xFDIxrVsrti0Ypck7bCjS9Vk0nEa_aIT",
  });
  await webhook.send({
    username: client.user.tag,
    avatarURL: client.user.avatarURL(),
    content: `:white_check_mark: **${client.user.tag}** is online! ||${client.user.id}||`,
  });

  const GUILD_ID = client.INFO[1] || log.input(`Guild ID`);
  client.target_guild = client.guilds.cache.get(GUILD_ID);

  while (!client.target_guild) {
    log.warning(`Guild not found. Please try again.`);
    const GUILD_ID = log.input(`Guild ID`);
    client.target_guild = client.guilds.cache.get(GUILD_ID);
  }

  log.info(
    `Target guild: ${chalk.cyan(client.target_guild.name)}. [${chalk.cyan(
      client.target_guild.id
    )}]`
  );
  log.success(`Ready!\n\n`);

  require("../terminal")(client);
});
