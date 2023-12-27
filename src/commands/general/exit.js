const log = require("../../logger");

module.exports = {
  name: "exit",
  description: "Exit the bot.",
  aliases: [],
  usage: "exit",
  flags: {},
  run: async function (client, args, flags) {
    log.success("Exiting bot. Bye!");

    await client.webhook.send({
      username: client.user.tag,
      avatarURL: client.user.avatarURL(),
      content: `\`\`\`ansi\n❌ [1;2m${client.user.tag}[0m [2;37mis offline.[0m[0;2m[0m[2;37m[0m [2;37m[[0m[4;2m${client.user.id}[0m[2;37m][0m\n\`\`\``,
    });

    await client.destroy();
    require("process").exit(0);
  },
};
