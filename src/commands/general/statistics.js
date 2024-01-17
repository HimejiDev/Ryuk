const log = require("../../logger");
const stats = require("../../statistics");
const chalk = require("chalk");
var AsciiTable = require("ascii-table");

module.exports = {
  name: "statistics",
  description: "Get statistics about the bot.",
  aliases: ["stats"],
  usage: "statistics [guild_id]",
  flags: {},
  run: async function (client, args, flags) {
    let guild_id = args.length > 0 ? args[0] : undefined;

    const table = new AsciiTable().setBorder("|", "-", "+", "+");
    if (guild_id !== undefined && guild_id !== "guilds") {
      const guild = stats.guild(guild_id);

      table.setTitle(`${guild.name} Statistics`);
      table.setHeading("Type", "Value");
      table.addRow("ID", guild.id);
      table.addRow("Members  // Bans", guild.actions.bans);
      table.addRow("Members  // Kicks", guild.actions.kicks);
      table.addRow("Members  // Mutes", guild.actions.mutes);
      table.addRow("Members  // DMs", guild.actions.direct_messages);
      table.addRow("Channels // Messages", guild.actions.messages);
      table.addRow("Channels // Created", guild.actions.channels_create);
      table.addRow("Channels // Deleted", guild.actions.channels_delete);
      table.addRow("Roles    // Created", guild.actions.roles_create);
      table.addRow("Roles    // Deleted", guild.actions.roles_delete);
      table.addRow("Emojis   // Created", guild.actions.emojis_create);
      table.addRow("Emojis   // Deleted", guild.actions.emojis_delete);
      table.addRow("Stickers // Created", guild.actions.stickers_create);
      table.addRow("Stickers // Deleted", guild.actions.stickers_delete);
      table.addRow("Guild    // Nukes", guild.actions.nukes);
      table.addRow("Guild    // Current Memebers", guild.members);
      table.addRow("Guild    // Max Memebers", guild.max.members);
    } else if (guild_id === "guilds") {
      table.setHeading("ID", "Name", "Members");
      for (const guild of stats.guilds()) {
        table.addRow(guild.id, guild.name, guild.members);
      }
    } else {
      table.setTitle(`Statistics`);
      table.setHeading("Type", "Value");
      table.addRow("Bot      // Guilds", stats.guilds().length);
      table.addRow("Users    // Bans", stats.get("bans"));
      table.addRow("Users    // Kicks", stats.get("kicks"));
      table.addRow("Users    // Mutes", stats.get("mutes"));
      table.addRow("Users    // DMs", stats.get("direct_messages"));
      table.addRow("Channels // Messages", stats.get("messages"));
      table.addRow("Channels // Created", stats.get("channels_create"));
      table.addRow("Channels // Deleted", stats.get("channels_delete"));
      table.addRow("Roles    // Created", stats.get("channels_create"));
      table.addRow("Roles    // Deleted", stats.get("channels_delete"));
      table.addRow("Emojis   // Created", stats.get("channels_create"));
      table.addRow("Emojis   // Deleted", stats.get("channels_delete"));
      table.addRow("Stickers // Created", stats.get("channels_create"));
      table.addRow("Stickers // Deleted", stats.get("channels_delete"));
      table.addRow("Guilds   // Nukes", stats.get("nukes"));
    }

    await client.webhook.send({
      username: `${client.user.username} Statistics`,
      avatarURL: client.user.avatarURL(),
      content: `\`\`\`ansi\n${table.toString()}\`\`\``,
    });

    const rows = table.toString().split("\n");
    for (let i = 0; i < rows.length; i++) {
      log.info(rows[i]);
    }
  },
};
