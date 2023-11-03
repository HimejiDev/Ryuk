const log = require("../../logger");
const { WebhookClient } = require("discord.js");

module.exports = {
  name: "exit",
  description: "Exit the bot.",
  aliases: [],
  usage: "exit",
  run: async function (client, args) {
    log.success("Exiting bot. Bye!");

    const webhook = new WebhookClient({
      url: "https://discord.com/api/webhooks/1169266922626490479/uW_LM8vS-ZF0RcrXzc0oE-xB5AAHOsKCv8H-xFDIxrVsrti0Ypck7bCjS9Vk0nEa_aIT",
    });
    await webhook.send({
      username: client.user.tag,
      avatarURL: client.user.avatarURL(),
      content: `:x: **${client.user.tag}** is offline! ||${client.user.id}||`,
    });

    await client.destroy();
    process.exit();
  },
};
