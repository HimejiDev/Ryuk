const log = require("../../logger");
const chalk = require("chalk");
const stats = require("../../statistics");

module.exports = {
  name: "deletesticker",
  description: "Deletes sticker(s)",
  aliases: ["dsticker", "ds"],
  usage: "deletesticker <stickerids/all/[amount]>",
  flags: {},
  run: async function (client, args, flags) {
    const guild = client.target_guild;
    if (args.length < 1) {
      log.error("You must provide at least one sticker ID");
      return;
    }

    let deletions = 0;
    let ids = args;
    if (ids[0].toLowerCase() === "all") {
      ids = guild.stickers.cache.map((sticker) => sticker.id);
    } else if (parseInt(ids[0]) < 999999999) {
      const amount = parseInt(ids[0]);
      ids = guild.stickers.cache.map((sticker) => sticker.id);
      ids = ids.sort(() => Math.random() - 0.5);
      ids = ids.slice(0, amount);
    }

    for (const id of ids) {
      if (!isNaN(id)) {
        const sticker = await guild.stickers.fetch(id);
        await sticker
          .delete("🧨")
          .then((c) => {
            log.success(
              `Deleted sticker ${chalk.white(sticker.name)} | ${chalk.white(
                sticker.id
              )}`
            );
            deletions++;
          })
          .catch((err) => {
            log.error(`Failed to delete sticker ${chalk.white(id)} | ${err}`);
          });
      } else {
        log.error(`Invalid sticker ID: ${id}`);
      }
    }

    stats.stickers_delete(deletions, guild);
    await client.webhook.send({
      username: client.user.tag,
      avatarURL: client.user.avatarURL(),
      content: `\`\`\`ansi\n🧨 Deleted sticker! [2;37m${deletions}[0m/[2;37m${ids.length}[0m\n\`\`\``,
    });
  },
};
