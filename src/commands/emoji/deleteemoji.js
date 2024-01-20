const log = require("../../logger");
const chalk = require("chalk");
const stats = require("../../statistics");

module.exports = {
  name: "deleteemoji",
  description: "Deletes emoji(s)",
  aliases: ["demoji", "de"],
  usage: "deleteemoji <emojiids/all/[amount]>",
  flags: {},
  run: async function (client, args, flags) {
    const guild = client.target_guild;
    if (args.length < 1) {
      log.error("You must provide at least one emoji ID");
      return;
    }

    let deletions = 0;
    let ids = args;
    if (ids[0].toLowerCase() === "all") {
      ids = guild.emojis.cache.map((emoji) => emoji.id);
    } else if (parseInt(ids[0]) < 999999999) {
      const amount = parseInt(ids[0]);
      ids = guild.emojis.cache.map((emoji) => emoji.id);
      ids = ids.sort(() => Math.random() - 0.5);
      ids = ids.slice(0, amount);
    }

    for (const id of ids) {
      if (!isNaN(id)) {
        const emoji = await guild.emojis.fetch(id);
        await emoji
          .delete("🧨")
          .then((c) => {
            log.success(
              `Deleted emoji ${chalk.white(
                ":" + emoji.name + ":"
              )} | ${chalk.white(emoji.id)}`
            );
            deletions++;
          })
          .catch((err) => {
            log.error(
              `Failed to delete emoji ${chalk.white(id)} | ${err}`,
              "src/commands/emoji/deleteemoji.js"
            );
          });
      } else {
        log.error(`Invalid emoji ID: ${id}`);
      }
    }

    stats.emojis_delete(deletions, guild);
    await client.webhook.send({
      username: client.user.tag,
      avatarURL: client.user.avatarURL(),
      content: `\`\`\`ansi\n🧨 Deleted emojis! [2;37m${deletions}[0m/[2;37m${ids.length}[0m\n\`\`\``,
    });
  },
};
