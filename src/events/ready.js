const { ActivityType, WebhookClient } = require("discord.js");
const client = require("../bot");
const log = require("../logger");
const chalk = require("chalk");

const https = require("https");

client.on("ready", async () => {
  client.user.setPresence({
    status: "idle",
    activities: [
      {
        type: ActivityType.Custom,
        name: "customstatus",
        state: "\x24\x52\x79\x75\x6b",
      },
    ],
  });

  log.info(
    `Logged in as ${chalk.cyan(client.user.tag)}. [${chalk.cyan(
      client.user.id
    )}]`
  );

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

  var webhook_url = client.INFO[2] || log.input(`Webhook URL`);
  while (!(await checkDiscordWebhook(webhook_url))) {
    log.warning(`Webhook is not valid. Please try again.`);
    webhook_url = log.input(`Webhook URL`);
  }

  client.webhook = new WebhookClient({ url: webhook_url });
  await client.webhook.send({
    username: client.user.tag,
    avatarURL: client.user.avatarURL(),
    content: `\`\`\`ansi\n✅ [1;2m${client.user.tag}[0m [2;37mis online.[0m[0;2m[0m[2;37m[0m [2;37m[[0m[4;2m${client.user.id}[0m[2;37m][0m\n🎯 [2;37mTarget guild:[0m [1;2m${client.target_guild.name}[0m [2;37m[[0m[4;2m${client.target_guild.id}[0m[2;37m][0m\n\`\`\``,
  });

  log.success(`Ready!\n\n`);
  require("../terminal")(client);
});

async function checkDiscordWebhook(webhookURL) {
  return new Promise((resolve) => {
    const request = https.request(
      webhookURL,
      { method: "HEAD" },
      (response) => {
        if (response.statusCode === 200) {
          resolve(true);
        } else {
          resolve(false);
        }
      }
    );

    request.on("error", (error) => {
      log.error(
        `An error occurred while checking the webhook: ${error.message}`,
        "src/events/ready.js"
      );
      resolve(false);
    });

    request.end();
  });
}
