const log = require("../../logger");
const { WebhookClient } = require("discord.js");

module.exports = {
  name: "exit",
  description: "Exit the bot.",
  aliases: [],
  usage: "exit",
  run: async function (client, args) {
    log.success("Exiting bot. Bye!");

    await client.webhook.send({
      username: client.user.tag,
      avatarURL: client.user.avatarURL(),
      content: `:x: **${client.user.tag}** is offline! ||${client.user.id}||`,
    });

    await client.destroy();
    process.exit(0);
  },
};
