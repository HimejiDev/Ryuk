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
client.historyIndex = 0;
client.commandHistory = [];

module.exports = client;

["command", "event"].forEach((handler) => {
  try {
    require(`./handlers/${handler}`)(client);
  } catch (error) {
    log.error(`Handler: ${handler} failed to call. | ${error}`, "src/bot.js");
  }
});

const input_string = `Load config? [Y]es/[N]o/[E]xit`;
var input = log.input(input_string, client);
while (
  input.toLowerCase() !== "y" &&
  input.toLowerCase() !== "n" &&
  input.toLowerCase() !== "e"
) {
  input = log.input(input_string, client);
}
if (input.toLowerCase() === "e") {
  log.success(`Exiting...`);
  require("process").exit(0);
} else if (input.toLowerCase() === "y") {
  try {
    client.INFO = fs.readFileSync("./config", "utf8").split("\n");
    client.INFO[0] = client.INFO[0].replace(/\r/g, "");
    client.INFO[1] = client.INFO[1].replace(/\r/g, "");
    client.INFO[2] = client.INFO[2].replace(/\r/g, "");
  } catch (error) {
    log.error(`Failed to load config. | ${error}`, "src/bot.js");
    client.INFO = [];
  }
} else {
  client.INFO = [];
}

input = log.input(`Start bot invisible? [Y]es/[N]o`, client);
while (input.toLowerCase() !== "y" && input.toLowerCase() !== "n") {
  input = log.input(`Start bot invisible? [Y]es/[N]o`, client);
}
client.invisible = input.toLowerCase() === "y" ? true : false;

var TOKEN = client.INFO[0] || log.input(`Bot Token`, client);

function login() {
  log.info(`Attempting to login in...`);
  client.login(TOKEN).catch((error) => {
    if (error.code === "TokenInvalid") {
      log.error(`Failed to login, try again. | ${error}`, "src/bot.js");
      TOKEN = client.INFO[0] || log.input(`Bot Token`, client);
      login();
    } else {
      log.error(`Failed to login. | ${error}`, "src/bot.js");
      log.error(`Exiting...`);
      require("process").exit(1);
    }
  });
}

login();

// ENOTFOUND
// TokenInvalid
// GatewayUnavailable
// GatewayError
