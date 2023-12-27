const chalk = require("chalk");
//const prompt = require("prompt-sync")({ sigint: true });
const readlineSync = require("readline-sync");

const pipe = chalk.dim(chalk.gray("|"));
const left = chalk.dim(chalk.gray("["));
const right = chalk.dim(chalk.gray("]"));

function getDate() {
  const date = new Date();

  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3,
    hour12: false,
  };

  return new Intl.DateTimeFormat("en-US", options)
    .format(date)
    .replace(",", "");
}

function log(level, message, path) {
  const levels = {
    info: {
      icon: "?",
      color: chalk.white,
    },
    success: {
      icon: "$",
      color: chalk.green,
    },
    warning: {
      icon: "*",
      color: chalk.yellow,
    },
    error: {
      icon: "!",
      color: chalk.red,
    },
    debug: {
      icon: "i",
      color: chalk.cyan,
    },
  };

  const levelInfo = levels[level] || levels.info;

  const formattedDate = chalk.dim(chalk.white(`${left}${getDate()}${right}`));

  console.log(
    levelInfo.color(
      `${formattedDate} ${left}${levelInfo.icon}${right} ${pipe} ${chalk.bold(
        message
      )}${path ? ` ${pipe} ${path}` : ""}`
    )
  );
}

function input(message, client) {
  // return prompt(
  //   chalk.white(
  //     `${left}${getDate()}${right} ${left}>${right} ${pipe}${
  //       message ? ` ${message}` : ""
  //     } >>> `
  //   )
  // );
  const userInput = readlineSync.question(
    chalk.white(
      `${left}${getDate()}${right} ${left}>${right} ${pipe}${
        message ? ` ${message}` : ""
      } >>> `
    ),
    {
      history: client.commandHistory,
      historyIndex: client.historyIndex,
    }
  );

  if (userInput.trim() !== "") {
    client.commandHistory.push(userInput);
    client.historyIndex = client.commandHistory.length;
  }

  return userInput;
}

module.exports = {
  info: (message, path) => log("info", message, path),
  success: (message, path) => log("success", message, path),
  warning: (message, path) => log("warning", message, path),
  error: (message, path) => log("error", message, path),
  debug: (message, path) => log("debug", message, path),
  input,
};
