const log = require("../../logger");
const chalk = require("chalk");

module.exports = {
  name: "reload",
  description: "Reloads the guild.",
  aliases: [],
  usage: "reload [-f <[T]rue>]",
  flags: { "-f": "Fetches all guild data." },
  run: async function (client, args, flags) {
    try {
      const GUILD_ID = client.INFO[1] || client.target_guild.id;
      client.target_guild = client.guilds.cache.get(GUILD_ID);
      log.info(`Reloading guild ${chalk.white(client.target_guild.name)}`);
      if (flags["-f"]) {
        await client.target_guild.members.fetch();
        log.info("Fetched members");
        await client.target_guild.channels.fetch();
        log.info("Fetched channels");
        await client.target_guild.roles.fetch();
        log.info("Fetched roles");
        await client.target_guild.emojis.fetch();
        log.info("Fetched emojis");
        await client.target_guild.stickers.fetch();
        log.info("Fetched stickers");
        await client.target_guild.bans.fetch();
        log.info("Fetched bans");
        await client.target_guild.invites.fetch();
        log.info("Fetched invites");
        await client.target_guild.features.fetch();
        log.info("Fetched features");
      }

      log.success(`Reloaded guild ${chalk.white(client.target_guild.name)}`);
    } catch (err) {
      log.error(
        `Failed to reload guild: ${err}`,
        "src/commands/general/reload.js"
      );
      return;
    }
  },
};
