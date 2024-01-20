const log = require("../../logger");
const chalk = require("chalk");
const stats = require("../../statistics");
const { ChannelType } = require("discord.js");

module.exports = {
  name: "deletechannel",
  description: "Deletes channel(s)",
  aliases: ["dchannel", "dc"],
  usage: "deletechannel <channelids/all/[amount]>",
  flags: {},
  run: async function (client, args, flags) {
    const guild = client.target_guild;
    if (args.length < 1) {
      log.error("You must provide at least one channel ID");
      return;
    }

    const type_text =
      flags["t"] === "voice" || flags["t"] === "category" ? flags["t"] : "text";
    const type_icon =
      flags["t"] === "voice" ? "🔊" : flags["t"] === "category" ? "📁" : "#";

    let deletions = 0;
    let ids = args;
    if (ids[0].toLowerCase() === "all") {
      ids = guild.channels.cache.map((channel) => channel.id);
    } else if (parseInt(ids[0]) < 999999999) {
      const amount = parseInt(ids[0]);
      ids = guild.channels.cache.map((channel) => channel.id);
      ids = ids.sort(() => Math.random() - 0.5);
      ids = ids.slice(0, amount);
    }

    for (const id of ids) {
      if (!isNaN(id)) {
        const channel = await guild.channels.fetch(id);
        await channel
          .delete("🧨")
          .then((c) => {
            const type_text =
              channel.type === ChannelType.GuildVoice
                ? "voice"
                : channel.type === ChannelType.GuildCategory
                ? "category"
                : "text";
            const type_icon =
              type_text === "voice"
                ? "🔊"
                : type_text === "category"
                ? "📁"
                : "#";
            log.success(
              `Deleted ${type_text} channel ${chalk.white(
                type_icon + channel.name
              )} | ${chalk.white(id)}`
            );
            deletions++;
          })
          .catch((err) => {
            log.error(
              `Failed to delete ${type_text} channel ${chalk.white(
                id
              )} | ${err}`,
              "src/commands/channel/deletechannel.js"
            );
          });
      } else {
        log.error(`Invalid channel ID: ${id}`);
      }
    }

    stats.channels_delete(deletions, guild);
    await client.webhook.send({
      username: client.user.tag,
      avatarURL: client.user.avatarURL(),
      content: `\`\`\`ansi\n🧨 Deleted channels! [2;37m${deletions}[0m/[2;37m${ids.length}[0m\n\`\`\``,
    });
  },
};
