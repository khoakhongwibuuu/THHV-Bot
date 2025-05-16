// Packages
const fs = require('fs');
const path = require('path');

// In-memory author ID of cached messages
let cachedObjId = {};
/*
cachedObjId = {
    "guild-id-1": {
        "channel-id-1": 1,
        "channel-id-2": 1,
        ...
    },
    "guild-id-2": {
        "channel-id-1": 1,
        "channel-id-2": 1,
        ...
    },
}
*/

// Ultility to get the guild config file path
const getGuildFilePath = (guildId) =>
    path.join(global.dirname, 'modules/react-2-pin/config', `${guildId}.json`);

// Guilds, channels, messages checkers
const isSetup = (guildId) => cachedObjId.hasOwnProperty(guildId);
const isThisChannelTracked = (guildId, channelId) => cachedObjId[guildId].hasOwnProperty(channelId);
const isAuthorMatched = (msgAuthorId, userId) => msgAuthorId === userId;

// File operations
const loadGuildFile = (guildId) =>
    JSON.parse(fs.readFileSync(getGuildFilePath(guildId), 'utf-8'));

const writeGuildFile = (guildId, newData) =>
    fs.writeFileSync(getGuildFilePath(guildId), JSON.stringify(newData), 'utf8');

// Module startup
const preLoad = (guildId) => {
    const guildData = loadGuildFile(guildId);
    cachedObjId[guildId] = guildData;
}

// Include a channel to the list of tracked channels
const includeChannel = (guildId, channelId) => {
    // Check if the guild is already set up, if not, initialise it
    if (!isSetup(guildId)) cachedObjId[guildId] = {};

    // Check if the channel is already being tracked, if so, exit
    if (isThisChannelTracked(guildId, channelId)) return false;
    // Main operation
    cachedObjId[guildId][channelId] = 1;

    // Write to the guild configuration file
    writeGuildFile(guildId, cachedObjId[guildId]);
    return true;
}

// Exclude a channel from the list of tracked channels
const excludeChannel = (guildId, channelId) => {
    // Check if the guild is already set up
    if (!isSetup(guildId)) return false;

    // Check if the channel is already being tracked, if not, exit
    if (!isThisChannelTracked(guildId, channelId)) return false;

    // Main operation
    delete cachedObjId[guildId][channelId];

    // Write to the guild configuration file
    writeGuildFile(guildId, cachedObjId[guildId]);

    // remove the guildid config file if all channels are removed
    if (Object.keys(cachedObjId[guildId]).length === 0) {
        delete cachedObjId[guildId];
        fs.unlinkSync(getGuildFilePath(guildId));
    }

    return true;
}

// View all tracked channels
const viewAllChannels = (guildId) => {
    if (!isSetup(guildId)) return null;
    return Object.keys(cachedObjId[guildId]);
}

// Remove all tracked channels of a guild
const guildReset = (guildId) => {
    if (!isSetup(guildId)) return false;
    delete cachedObjId[guildId];
    fs.unlinkSync(getGuildFilePath(guildId));
    return true;
}

// Handle pin request
const handleRequest = async (reaction, user) => {
    // Check if the message is sent in a guild or not
    if (!reaction.message.guild.id) return;

    // Checkers
    if (reaction.emoji.name !== '📌') return;
    if (!isSetup(reaction.message.guild.id)) return;
    if (!isThisChannelTracked(reaction.message.guild.id, reaction.message.channel.id)) return;

    // Ensure the reaction is fully cached
    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (err) {
            return;
        }
    }

    // Check if the author is the same as the one who reacted
    if (!isAuthorMatched(reaction.message.author.id, user.id)) return;

    // Check if the message is already pinned
    await reaction.users.remove(user.id);
    if (reaction.message.pinned) {
        try {
            await reaction.message.unpin();
        } catch (err) {
            console.error(err);
        }
    } else {
        try {
            await reaction.message.pin();
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = {
    preLoad,
    includeChannel,
    excludeChannel,
    viewAllChannels,
    guildReset,
    handleRequest,
    isSetup,
    isThisChannelTracked,
    isAuthorMatched
}