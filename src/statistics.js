const fs = require("fs");
const path = require("path");
const statistics = require("../statistics.json");

function updateStats(type, amount, guild) {
  const index = getGuildIndex(guild.id);

  console.log(index);
  if (index !== -1) {
    updateExistingGuildStats(index, type, amount, guild);
  } else {
    addNewGuildStats(type, amount, guild);
  }

  saveStatisticsToFile();
}

function getTotalActions(type) {
  let total = 0;
  for (const guild of statistics) {
    total += guild.actions[type];
  }
  return total;
}

function getGuildIndex(guildId) {
  return statistics.findIndex((guild) => guild.id === guildId);
}

function updateExistingGuildStats(index, type, amount, guild) {
  const currentGuild = statistics[index];

  currentGuild.actions[type] += amount;

  updateMaxValues(currentGuild, guild);

  statistics[index] = currentGuild;
}

function addNewGuildStats(type, amount, guild) {
  const newGuild = {
    id: guild.id,
    name: guild.name,
    icon: guild.iconURL(),
    owner: guild.ownerId,
    description: guild.description,
    members: guild.memberCount,
    channels: guild.channels.cache.size,
    roles: guild.roles.cache.size,
    emojis: guild.emojis.cache.size,
    stickers: guild.stickers.cache.size,
    boosts: guild.premiumSubscriptionCount,
    created: guild.createdAt,
    joined: guild.joinedAt,
    actions: {
      bans: 0,
      kicks: 0,
      mutes: 0,
      nukes: 0,
      channels_create: 0,
      channels_delete: 0,
      roles_create: 0,
      roles_delete: 0,
      emojis_create: 0,
      emojis_delete: 0,
      stickers_create: 0,
      stickers_delete: 0,
      messages: 0,
    },
    max: {
      members: guild.memberCount,
      channels: guild.channels.cache.size,
      roles: guild.roles.cache.size,
      emojis: guild.emojis.cache.size,
      stickers: guild.stickers.cache.size,
      boosts: guild.premiumSubscriptionCount,
    },
  };

  newGuild.actions[type] += amount;

  statistics.push(newGuild);
}

function updateMaxValues(currentGuild, guild) {
  const maxValues = {
    members: guild.memberCount,
    channels: guild.channels.cache.size,
    roles: guild.roles.cache.size,
    emojis: guild.emojis.cache.size,
    stickers: guild.stickers.cache.size,
    boosts: guild.premiumSubscriptionCount,
  };

  for (const [key, value] of Object.entries(maxValues)) {
    if (value > currentGuild.max[key]) {
      currentGuild.max[key] = value;
    }
  }
}

function saveStatisticsToFile() {
  fs.writeFileSync(
    path.join(__dirname, "../statistics.json"),
    JSON.stringify(statistics, null, 2)
  );
}

module.exports = {
  bans: (amount, guild) => updateStats("bans", amount, guild),
  kicks: (amount, guild) => updateStats("kicks", amount, guild),
  mutes: (amount, guild) => updateStats("mutes", amount, guild),
  nukes: (guild) => updateStats("nukes", 0, guild),
  channels_create: (amount, guild) =>
    updateStats("channels_create", amount, guild),
  channels_delete: (amount, guild) =>
    updateStats("channels_delete", amount, guild),
  roles_create: (amount, guild) => updateStats("roles_create", amount, guild),
  roles_delete: (amount, guild) => updateStats("roles_delete", amount, guild),
  emojis_create: (amount, guild) => updateStats("emojis_create", amount, guild),
  emojis_delete: (amount, guild) => updateStats("emojis_delete", amount, guild),
  stickers_create: (amount, guild) =>
    updateStats("stickers_create", amount, guild),
  stickers_delete: (amount, guild) =>
    updateStats("stickers_delete", amount, guild),
  messages: (amount, guild) => updateStats("messages", amount, guild),

  get: (type) => getTotalActions(type),
  guild: (guild) => statistics[getGuildIndex(guild)],
};