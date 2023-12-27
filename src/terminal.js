const log = require("./logger");
const { parseCommand } = require("./functions");

module.exports = async (client) => {
  const input = log.input("", client);

  const cmd = input.split(" ")[0].toLowerCase();
  const command =
    client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));

  //const args = input.split(" ").slice(1);

  if (command) {
    const command_info = parseCommand(input);
    try {
      await command.run(client, command_info.args, command_info.flags);
    } catch (err) {
      log.error(`Failed to run command ${cmd}: ${err}`, "src/terminal.js");
    }
  } else !command && input && log.warning(`Command not found: ${cmd}`);

  // if (cmd === "exit") {
  //   log.success("Exiting bot. Bye!");

  //   const webhook = new WebhookClient({
  //     url: "https://discord.com/api/webhooks/1169266922626490479/uW_LM8vS-ZF0RcrXzc0oE-xB5AAHOsKCv8H-xFDIxrVsrti0Ypck7bCjS9Vk0nEa_aIT",
  //   });
  //   await webhook.send({
  //     username: client.user.tag,
  //     avatarURL: client.user.avatarURL(),
  //     content: `:x: **${client.user.tag}** is offline! ||${client.user.id}||`,
  //   });

  //   await client.destroy();
  //   process.exit();
  // }

  require("./terminal")(client);
};
