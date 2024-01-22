# Ryuk 🧨

![Spongebob](spongebob.png)

[~~ DISCORD ~~](https://discord.gg/49rUCrxda9)

## Description 📝

Ryuk is a multi-purpose tool designed for educational purposes. It provides a range of commands for server management, moderation, and more, with a primary focus on demonstrating how a bot can be used to control a server, including destructive actions like a server nuke 💥. The bot is controlled via the terminal/cli, making it easy to control.

Please use this project responsibly and only in a controlled environment, such as your personal server. Do not use it to disrupt or harm other communities. It is essential to respect Discord's Terms of Service and Community Guidelines.

## Features 🚀

- **CLI Control** 💻: Interact with your bot via your terminal/command prompt.
- **Server Management** 🛠️: Control various aspects of your server, such as roles, channels, and more.
- **Moderation Tools** 🛡️: Basic moderation features, like kicking, muting and banning members.
- **Customizability** 🎨: Change the bots appearance, and/or add your own commands.
- **Custom Code Execution** 💡: Easily execute code without restarting using the `eval` command.
- **Server Nuke 💣**: Execute a server nuke command to demonstrate its impact (for educational purposes only).

## Getting Started 🛠️

1. **Prerequisites**: Before using this project, ensure you have [Node.js](https://nodejs.org/en) and npm installed on your computer. And have an application/bot created here: [Discord Developer Portal](https://discord.com/developers/applications)

2. **Clone the Repository**: Clone this repository to your local machine:

```ssh
git clone https://github.com/HimejiDev/Ryuk.git
cd Ryuk
```

3. **Install Dependencies**: Run the following command to install the required dependencies:

```ssh
npm install
```

4. **Invite the Bot**: Invite your bot to your Discord server using the OAuth2 URL generated in the [Discord Developer Portal](https://discord.com/developers/applications).

5. **Configure the Bot**:

- Obtain the bot token from the [Discord Developer Portal](https://discord.com/developers/applications).
- Enable all the "Privileged Gateway Intents" in the [Discord Developer Portal](https://discord.com/developers/applications), under the "Bot" tab.
- You can either input the _TOKEN_ and _GUILD ID_ when starting or use the `config` file:

```
YOUR_BOT_TOKEN
YOUR_GUILD_ID
YOUR_WEBHOOK_URL
```

6. **Start the Bot**:

- Open your terminal and navigate to the project directory.
- Run the bot using the following command:

```ssh
npm start
```

7. **Bot Commands**: Access the bot's commands in the server and explore its features. Please use the commands responsibly. Use `help` for more information.

## Usage 🕹️

- For a list of available commands, type `help` in the terminal.
- Use the bot commands to manage your server and explore its capabilities.
- Join the [discord](https://discord.gg/49rUCrxda9) for updates and support.

### Creating a Command 🛠️

- Create a javascript in a directory inside the `src/commands` folder. For example: `src/command/customcommands/custom_command.js`
- Paste the following template, and make changes where necessary.

```javascript
const log = require("../../logger");
const chalk = require("chalk");

module.exports = {
  name: "ccommand",
  description: "A custom command.",
  aliases: ["cc"],
  usage: "ccomand",
  flags: {},
  run: async function (client, args, flags) {
    log.debug(`Ping? Pong!`);
  },
};
```

- Check other commands for inspiration, or how to use certain items.

## Disclaimer ⚠️

This project is intended for educational purposes only. Misuse or abuse of the project may violate Discord's Terms of Service and could lead to account and/or bot suspension or legal consequences. Use this project responsibly and only on servers you have permission to manage. The developers are NOT responsible for any damages done to any servers or members. ⚠️

## License 📜

This project is licensed under the MIT License. See the [LICENSE](LICENSE) for details.

---

I know the name is kinda cringe 😅.
