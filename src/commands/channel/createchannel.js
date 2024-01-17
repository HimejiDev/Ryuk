const log = require("../../logger");
const chalk = require("chalk");
const stats = require("../../statistics");
const { ChannelType } = require("discord.js");

module.exports = {
  name: "createchannel",
  description: "Evaluate code",
  aliases: ["cchannel", "cc"],
  usage: "createchannel <channelname> [-a <amount>] [-t <text|voice|category>]",
  flags: { "-a": "Amount of channels to create" },
  run: async function (client, args, flags) {
    const amount = flags["a"] || 1;
    const type =
      flags["t"] === "voice"
        ? ChannelType.GuildVoice
        : flags["t"] === "category"
        ? ChannelType.GuildCategory
        : ChannelType.GuildText;
    const channelName = args.join("-");
    const guild = client.target_guild;

    let creations = 0;

    const type_text =
      flags["t"] === "voice" || flags["t"] === "category" ? flags["t"] : "text";
    const type_icon =
      flags["t"] === "voice" ? "🔊" : flags["t"] === "category" ? "📁" : "#";

    for (let i = 0; i < amount; i++) {
      await guild.channels
        .create({ name: channelName, reason: "🧨", type: type })
        .then((channel) => {
          log.success(
            `Created ${type_text} channel ${chalk.white(
              type_icon + channel.name
            )}`
          );
          creations++;
        })
        .catch((err) => {
          log.error(
            `Failed to create ${type_text} channel ${chalk.white(
              type_icon + channelName
            )} | ${err}`
          );
        });
    }

    stats.channels_create(creations, guild);
    await client.webhook.send({
      username: client.user.tag,
      avatarURL: client.user.avatarURL(),
      content: `\`\`\`ansi\n🧨 Created channels! [2;37m${creations}[0m/[2;37m${amount}[0m\n\`\`\``,
    });
  },
};
