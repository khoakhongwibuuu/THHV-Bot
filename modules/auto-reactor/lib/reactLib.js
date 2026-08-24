// Packages
const fs = require('node:fs');
const path = require('node:path');
const { dirname } = global.variable;

// In-memory channel-ids for each guilds storage
let channelIdList = {};
/*
channelIdList = {
    "guild-id-1": "channel-id-1",
    "guild-id-2": "channel-id-2",
    ...
}
*/

// In-memory tracking for listened messages
let listenMessage = {};
/*
listenMessage = {
    "guild-id-1": {
        "message-id-1" : 1,
        "message-id-2" : 1,
        ...
    },
    "guild-id-2": {
        "message-id-1" : 1,
        "message-id-2" : 1,
        ...
    },
    ...
}
*/

// Utility to get the guild config file path
const getGuildFilePath = (guildId) =>
    path.join(dirname, 'configs/auto-reactor/config', `${guildId}.json`);

// Check if the guild has a config file
const isSetup = (guildId) =>
    channelIdList.hasOwnProperty(guildId)
    && listenMessage.hasOwnProperty(guildId);

// Load guild configuration file
const loadGuildFile = (guildId) => JSON.parse(fs.readFileSync(getGuildFilePath(guildId), 'utf-8'));

// Write new data to the guild configuration file
const writeGuildFile = (guildId, newData) => fs.writeFileSync(getGuildFilePath(guildId), JSON.stringify(newData), 'utf8');

// Flush all tracked messages for a guild
const flushGuild = (guildId) => {
    if (!isSetup(guildId)) return;
    listenMessage[guildId] = {};

    const guildData = loadGuildFile(guildId);
    if (guildData) {
        guildData.listenMessage = {};
        writeGuildFile(guildId, guildData);
    }
}

// Load autio-reaction channelId for each set up guilds
const preLoad = (guildId) => {
    const guildData = loadGuildFile(guildId);
    channelIdList[guildId] = guildData.channelId;
    listenMessage[guildId] = {};
    Object.keys(guildData.listenMessage).forEach(messageId => {
        listenMessage[guildId][messageId] = 1;
    });
}

// Set up guild configuration
const guildSetup = (guildId, channelId, upvoteToken, downvoteToken) => {
    channelIdList[guildId] = channelId;
    listenMessage[guildId] = {};
    writeGuildFile(guildId, {
        channelId,
        upvoteToken,
        downvoteToken,
        listenMessage: {}
    });
}

// Reset guild configuration
const guildReset = (guildId) => {
    if (isSetup(guildId)) fs.unlinkSync(getGuildFilePath(guildId));
    delete listenMessage[guildId];
    delete channelIdList[guildId];
}

// Check if a channel is configured for auto-reactions
const isInRoom = (guildId, channelId) => isSetup(guildId) ? channelIdList[guildId] === channelId : false;

// Check if a string starts with a specific prefix (case insensitive)
const isPrefix = (str, prefix) => str.toLowerCase().startsWith(prefix.toLowerCase());

// Check if a message is being tracked
const isListened = (guildId, messageId) => {
    if (!isSetup(guildId)) return false;
    else return listenMessage[guildId].hasOwnProperty(messageId);
};

// Extract token name from custom emoji format
const getTokenName = (token) => {
    const start = token.indexOf(':') + 1;
    const end = token.lastIndexOf(':');

    if (start >= 0 && end > start) {
        return token.slice(start, end);
    }
    return token;
}

// Extract token ID from custom emoji format
const getTokenId = (token) => {
    const start = token.lastIndexOf(':') + 1;
    const end = token.lastIndexOf('>');

    if (start >= 0 && end > start) {
        return token.slice(start, end);
    }
    return token;
}

// Initialize auto-reactions on a message
const initialiseInput = (msg) => {
    if (!msg || !msg.guild || !msg.guild.id ||
        !msg.channel || !msg.channel.id) return;

    if (!isInRoom(msg.guild.id, msg.channel.id)) return;
    if (!isPrefix(msg.content, "suggest") && !isPrefix(msg.content, "vote")) return;

    const guildData = loadGuildFile(msg.guild.id);
    if (!guildData) return;

    try {
        msg.react(guildData.upvoteToken);
        msg.react(guildData.downvoteToken);

        listenMessage[msg.guild.id][msg.id] = 1;
        guildData.listenMessage[msg.id] = 1;
        writeGuildFile(msg.guild.id, guildData);
    } catch (error) {
        console.error(error);
    }
}

// Handle reaction events & prevent double-voting
const handleReaction = async (reaction, user) => {
    if (!reaction.message.guildId) return;
    if (user.bot || !isListened(reaction.message.guildId, reaction.message.id)) return;

    try {
        await reaction.message.fetch();
        const guildData = loadGuildFile(reaction.message.guildId);
        if (!guildData) return;

        const { upvoteToken, downvoteToken } = guildData;
        if (![getTokenName(upvoteToken), getTokenName(downvoteToken)].includes(reaction.emoji.name)) return;

        const oppositeToken = reaction.emoji.name === getTokenName(upvoteToken)
            ? getTokenId(downvoteToken) : getTokenId(upvoteToken);
        const oppositeReaction = reaction.message.reactions.cache.get(oppositeToken);

        if (oppositeReaction) {
            const users = await oppositeReaction.users.fetch();
            if (users.has(user.id)) {
                await oppositeReaction.users.remove(user.id);
            }
        }
    } catch (error) {
        console.error(error);
    }
}

// Remove a tracked message
const removeMessage = (msg) => {
    if (!msg || !msg.guild || !msg.guild.id ||
        !msg.channel || !msg.channel.id) return;

    if (!isInRoom(msg.guild.id, msg.channel.id)) return;

    if (isListened(msg.guild.id, msg.id)) {
        delete listenMessage[msg.guild.id][msg.id];

        // Remove from configuration file
        const guildData = loadGuildFile(msg.guild.id);
        if (guildData) {
            delete guildData.listenMessage[msg.id];
            writeGuildFile(msg.guild.id, guildData);
        }
    }
}

module.exports = {
    getGuildFilePath,
    isSetup,
    loadGuildFile,
    preLoad,
    guildSetup,
    guildReset,
    isInRoom,
    isPrefix,
    isListened,
    getTokenName,
    getTokenId,
    removeMessage,
    flushGuild,
    initialiseInput,
    handleReaction
};
