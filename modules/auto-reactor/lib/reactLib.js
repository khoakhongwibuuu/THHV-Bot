// Packages
const fs = require('fs');
const path = require('path');

// In-memory tracking for listened messages
let listenMessage = {};

// Utility to get the guild config file path
const getGuildFilePath = (guildId) => path.join(global.dirname, 'modules/auto-reactor/config', `${guildId}.json`);

// Check if the guild has a config file
const isSetup = (guildId) => fs.existsSync(getGuildFilePath(guildId));

// Load guild configuration file
const loadGuildFile = (guildId) => isSetup(guildId) ? JSON.parse(fs.readFileSync(getGuildFilePath(guildId), 'utf-8')) : null;

// Write new data to the guild configuration file
const writeGuildFile = (guildId, newData) => fs.writeFileSync(getGuildFilePath(guildId), JSON.stringify(newData), 'utf8');

// Check if a channel is configured for auto-reactions
const isInRoom = (guildId, channelId) => {
    const guildData = loadGuildFile(guildId);
    return guildData ? guildData.channelId === channelId : false;
}

// Check if a string starts with a specific prefix (case insensitive)
const isPrefix = (str, prefix) => str.toLowerCase().startsWith(prefix.toLowerCase());

// Set up guild configuration
const guildSetup = (guildId, channelId, upvoteToken, downvoteToken) => {
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
    delete listenMessage[guildId];
    if (isSetup(guildId)) fs.unlinkSync(getGuildFilePath(guildId));
}

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

// Check if a message is being tracked
const isListened = (guildId, messageId) => listenMessage[guildId]?.hasOwnProperty(messageId) || false;

// Add a message to tracking
const addMessage = (guildId, messageId) => {
    listenMessage[guildId] ??= {};
    listenMessage[guildId][messageId] = 1;
}

// Remove a tracked message
const removeMessage = (msg) => {
    const { guild, channel, id: messageId } = msg;
    if (!isInRoom(guild.id, channel.id)) return;

    if (isListened(guild.id, messageId)) {
        delete listenMessage[guild.id][messageId];
        if (Object.keys(listenMessage[guild.id]).length === 0) delete listenMessage[guild.id];

        // Remove from configuration file
        const guildData = loadGuildFile(guild.id);
        if (guildData) {
            delete guildData.listenMessage[messageId];
            writeGuildFile(guild.id, guildData);
        }
    }
}

// Flush all tracked messages for a guild
const flushGuild = (guildId) => {
    delete listenMessage[guildId];

    const guildData = loadGuildFile(guildId);
    if (guildData) {
        guildData.listenMessage = {};
        writeGuildFile(guildId, guildData);
    }
}

// Initialize auto-reactions on a message
const initialiseInput = (msg) => {
    if (!isInRoom(msg.guild.id, msg.channel.id)) return;
    if (!isPrefix(msg.content, "suggest") && !isPrefix(msg.content, "vote")) return;

    const guildData = loadGuildFile(msg.guild.id);
    if (!guildData) return;

    try {
        msg.react(guildData.upvoteToken);
        msg.react(guildData.downvoteToken);

        addMessage(msg.guild.id, msg.id);
        guildData.listenMessage[msg.id] = 1;
        writeGuildFile(msg.guild.id, guildData);
    } catch (error) {
        console.error(error);
    }
}

// Handle reaction events & prevent double-voting
const handleReaction = async (reaction, user) => {
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

module.exports = {
    isSetup,
    loadGuildFile,
    writeGuildFile,
    isInRoom,
    isPrefix,
    guildSetup,
    guildReset,
    getTokenName,
    getTokenId,
    isListened,
    addMessage,
    removeMessage,
    flushGuild,
    initialiseInput,
    handleReaction
};
