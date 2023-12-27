function parseCommand(input) {
  const parts = input.match(/(?:[^\s"']+|"([^"]*)"|'([^']*)')+/g);
  const command = parts[0];
  const args = [];
  const flags = {};

  let currentFlag = null;
  let currentFlagValue = null;

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];

    if (part.startsWith("-")) {
      if (currentFlag) {
        flags[currentFlag] = currentFlagValue;
      }
      currentFlag = part.slice(1);
      currentFlagValue = null;
    } else {
      if (currentFlag !== null) {
        if (part.startsWith('"')) {
          currentFlagValue = part.slice(1, -1);
        } else {
          currentFlagValue = part;
        }
        flags[currentFlag] = currentFlagValue;
        currentFlag = null;
      } else {
        args.push(part);
      }
    }
  }

  if (currentFlag) {
    flags[currentFlag] = currentFlagValue || true;
  }

  return {
    command,
    args,
    flags,
  };
}

module.exports = {
  parseCommand,
};
