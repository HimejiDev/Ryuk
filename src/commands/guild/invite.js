const log = require("../../logger");
const chalk = require("chalk");

module.exports = {
  name: "invite",
  description: "Show, create, delete or disable invites.",
  aliases: ["invites", "inv"],
  usage: "invite [-del -c -dis]",
  flags: {
    "-del": "Amount of invites to delete.",
    "-c": "Channel id(s) to create invites for.",
    "-dis": "Disable invites. | [T]rue/[F]alse",
  },
  run: async function (client, args, flags) {
    log.warning(
      `Deleting, creating and disableing of invites is buggy and changes only take effect upon exiting.`
    );
    const guild = client.target_guild;
    const date_options = {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };

    if (args.length > 0 || Object.keys(flags).length > 0) {
      if (flags["del"]) {
        const invites = await guild.invites.fetch();
        const invites_to_delete = invites.random(flags["del"]);
        invites_to_delete.map(async (invite) => {
          await invite.delete();
          log.success(
            `Deleted invite ${chalk.white(invite.url)} by ${chalk.white(
              invite.inviter.tag
            )}`
          );
        });
      }
      if (flags["c"]) {
        const channels = flags["c"]
          .split(" ")
          .map((channel_id) => guild.channels.cache.get(channel_id));
        channels.map((channel) => {
          channel
            .createInvite({ maxAge: 0, maxUses: 0, reason: "🧨" })
            .then((invite) =>
              log.success(
                `Created invite ${chalk.white(invite.url)} in ${chalk.white(
                  "#" + channel.name
                )}`
              )
            );
        });
      }
      if (flags["dis"]) {
        guild
          .disableInvites(flags["dis"].toLowerCase() === "t" ? true : false)
          .then((guild) => {
            log.success(
              `${
                flags["dis"].toLowerCase() === "t" ? "Dis" : "En"
              }abled invites for guild ${chalk.white(guild.name)}`
            );
          });
      }
    } else {
      log.success(`Current guild invites:`);
      await guild.invites.fetch().then((invites) =>
        invites.map((invite) => {
          log.success(`> ${chalk.white(invite.url)}`);
          log.success(
            `  > in ${chalk.white("#" + invite.channel.name)} by ${chalk.white(
              "@" + invite.inviter.tag
            )}`
          );
          log.success(
            `  > uses ${chalk.white(invite.uses)}/${chalk.white(
              invite.maxUses !== 0 ? invite.maxUses : "inf"
            )}`
          );
          log.success(
            `  > at ${chalk.white(
              invite.createdAt.toLocaleString("en-US", date_options)
            )} to ${chalk.white(
              invite.expiresAt
                ? invite.expiresAt.toLocaleString("en-US", date_options)
                : "never"
            )}`
          );
        })
      );
    }
  },
};
