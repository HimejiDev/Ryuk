const log = require("../../logger");
const chalk = require("chalk");
const stats = require("../../statistics");

module.exports = {
  name: "createemoji",
  description: "Creates emoji(s)",
  aliases: ["cemoji", "ce"],
  usage: "createemoji <img_url> <emoji_name> [-a <amount>]",
  flags: { "-a": "Amount of emojis to create" },
  run: async function (client, args, flags) {
    if (args.length < 2) {
      log.error("You must provide an image URL and an emoji name");
      return;
    }

    const amount = flags["a"] || 1;
    const img_url = args[0];
    const emojiName = args.slice(1).join(" ");
    const guild = client.target_guild;

    let creations = 0;

    for (let i = 0; i < amount; i++) {
      const name = emojiName + "_" + Math.random().toString(36).substring(2, 5);
      await guild.emojis
        .create({
          attachment: img_url,
          name: name,
        })
        .then((emoji) => {
          log.success(
            `Created emoji ${chalk.white(
              ":" + emoji.name + ":"
            )} | ${chalk.white(emoji.id)}`
          );
          creations++;
        })
        .catch((err) => {
          log.error(
            `Failed to create emoji ${chalk.white(":" + name + ":")} | ${err}`
          );
        });
    }

    stats.emojis_create(creations, guild);
    await client.webhook.send({
      username: client.user.tag,
      avatarURL: client.user.avatarURL(),
      content: `\`\`\`ansi\n🧨 Created emojis! [2;37m${creations}[0m/[2;37m${amount}[0m\n\`\`\``,
    });
  },
};
