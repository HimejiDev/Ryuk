const log = require("../../logger");
const chalk = require("chalk");
const stats = require("../../statistics");

module.exports = {
  name: "createsticker",
  description: "Creates sticker(s)",
  aliases: ["csticker", "cs"],
  usage: "createsticker <img_url> <sticker_name> [-a <amount>]",
  flags: { "-a": "Amount of stickers to create" },
  run: async function (client, args, flags) {
    if (args.length < 2) {
      log.error("You must provide an image URL and an sticker name");
      return;
    }

    const amount = flags["a"] || 1;
    const img_url = args[0];
    const stickerName = args.slice(1).join(" ");
    const guild = client.target_guild;

    let creations = 0;

    for (let i = 0; i < amount; i++) {
      const name =
        stickerName + "_" + Math.random().toString(36).substring(2, 5);
      await guild.stickers
        .create({
          file: img_url,
          name: name,
          tags: "🧨",
        })
        .then((sticker) => {
          log.success(
            `Created sticker ${chalk.white(sticker.name)} | ${chalk.white(
              sticker.id
            )}`
          );
          creations++;
        })
        .catch((err) => {
          log.error(
            `Failed to create sticker ${chalk.white(name)} | ${err}`,
            "src/commands/sticker/createsticker.js"
          );
        });
    }

    stats.stickers_create(creations, guild);
    await client.webhook.send({
      username: client.user.tag,
      avatarURL: client.user.avatarURL(),
      content: `\`\`\`ansi\n🧨 Created stickers! [2;37m${creations}[0m/[2;37m${amount}[0m\n\`\`\``,
    });
  },
};
