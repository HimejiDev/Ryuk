const log = require("../../logger");
const stats = require("../../statistics");
const chalk = require("chalk");

module.exports = {
  name: "sendchannel",
  description: "Sends a message to channel(s).",
  aliases: ["schannel", "sc"],
  usage:
    "sendchannel <channelids/all/[amount]> [-m <message>] [-s <spam_amount>] [-w <true/false>]",
  flags: {
    "-m": "Message to send",
    "-s": "Spam amount",
    "-w": "Whether to send the message with a webhook or not.",
  },
  run: async function (client, args, flags) {
    const guild = client.target_guild;
    if (args.length < 1) {
      log.error("You must provide at least one channel ID");
      return;
    }

    // const id = args[0];
    // const channel = await guild.channels.fetch(id);
    // if (!channel) {
    //   log.error("Channel not found");
    //   return;
    // }
    let messages = 0;
    let ids = args;
    if (ids[0].toLowerCase() === "all") {
      ids = guild.channels.cache.map((channel) => channel.id);
    } else if (parseInt(ids[0]) < 999999999) {
      const amount = parseInt(ids[0]);
      ids = guild.channels.cache.map((channel) => channel.id);
      ids = ids.sort(() => Math.random() - 0.5);
      ids = ids.slice(0, amount);
    }

    const message = flags["m"] ? flags["m"] : "`🧨`";
    const amount = flags["s"] ? flags["s"] : 1;

    for (var i = 0; i < amount; i++) {
      for (const id of ids) {
        if (!isNaN(id)) {
          const channel = await guild.channels.fetch(id);
          if (flags["w"] === "true") {
            const webhooks = await channel.fetchWebhooks();
            const webhook =
              webhooks.first() ||
              (await channel.createWebhook({
                name: client.user.username,
                avatar: client.user.avatarURL(),
              }));

            await webhook
              .send(message)
              .then(() => {
                log.success(
                  `Send message in ${chalk.white(
                    "#" + channel.name
                  )} | ${chalk.white(channel.id)} > ${chalk.white(
                    '"' + message + '"'
                  )}`
                );
                messages++;
              })
              .catch((err) =>
                log.error(
                  `Failed to send message in channel ${chalk.white(
                    id
                  )} | ${err}`
                )
              );
          } else {
            await channel
              .send(message)
              .then(() => {
                log.success(
                  `Send message in ${chalk.white(
                    "#" + channel.name
                  )} > ${chalk.white(message)}`
                );
                messages++;
              })
              .catch((err) =>
                log.error(
                  `Failed to send message in channel ${chalk.white(
                    id
                  )} | ${err}`
                )
              );
          }
        } else {
          log.error(`Invalid channel ID: ${id}`);
        }
      }
    }

    stats.messages(messages, guild);
    await client.webhook.send({
      username: client.user.tag,
      avatarURL: client.user.avatarURL(),
      content: `\`\`\`ansi\n🧨 Send messages in channels! [2;37m${messages}[0m/[2;37m${
        ids.length * amount
      }[0m\n\`\`\``,
    });
  },
};
