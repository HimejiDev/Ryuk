const chalk = require("chalk");
const fs = require("fs");
const log = require("./logger");
const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");

console.clear();

log.error(`by @himeji. ${chalk.white(">>")} https://himeji.dev/\n`);
log.info(`Starting...`);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.User,
    Partials.GuildMember,
    Partials.Reaction,
  ],
});

client.commands = new Collection();
client.aliases = new Collection();

module.exports = client;

["command", "event"].forEach((handler) => {
  try {
    require(`./handlers/${handler}`)(client);
  } catch (error) {
    log.error(`Handler: ${handler} failed to call. | ${error}`, "src/bot.js");
  }
});

var input = log.input(`Load Config [y/n/e(xit)]`);
while (input !== "y" && input !== "n" && input !== "e") {
  input = log.input(`Load Config [y/n/e(xit)]`);
}
if (input === "e") {
  log.success(`Exiting...`);
  process.exit();
} else if (input === "y") {
  client.INFO = fs.readFileSync("./config", "utf8").split("\n");
  client.INFO[0] = client.INFO[0].replace(/\r/g, "");
} else {
  client.INFO = [];
}

const TOKEN = client.INFO[0] || log.input(`\nBot Token`);

log.info(`Logging in...`);
client.login(TOKEN).catch((error) => {
  log.error(`Failed to login. | ${error}`, "src/bot.js");
  log.error(`Exiting...`);
  require("process").exit(1);
});
