// Packages
const fs = require('fs');
const path = require('path');

// Functions
const isSetup = (guildId) => {
    const guildDataPath = path.join(global.dirname, 'modules/auto-reactor/config', `${guildId}.json`);
    return fs.existsSync(guildDataPath);
}

const loadGuildFile = (guildId) => {
    const guildDataPath = path.join(global.dirname, 'modules/auto-reactor/config', `${guildId}.json`);
    return JSON.parse(fs.readFileSync(guildDataPath, 'utf-8'));
}

const writeGuildFile = (guildId, newData) => {
    const guildDataPath = path.join(global.dirname, 'modules/auto-reactor/config', `${guildId}.json`);
    fs.writeFileSync(guildDataPath, JSON.stringify(newData), 'utf8');
}

const isInRoom = (guildId, channelId) => {
    if (!isSetup(guildId)) return false;
    let guildData = loadGuildFile(guildId);
    return (channelId === guildData.channelId)
}

const isPrefix = (str, prefix) => {
    return str.toLowerCase().startsWith(prefix.toLowerCase());
}

const guildSetup = (guildId, channelId, upvoteToken, downvoteToken) => {
    const guildDataPath = path.join(global.dirname, 'modules/auto-reactor/config', `${guildId}.json`);
    // allow override in installed guilds
    fs.writeFileSync(guildDataPath, JSON.stringify({
        // Auto reactor will not be triggered OUTSIDE this channel
        channelId: channelId,

        // UPVOTE and DOWNVOTE token
        upvoteToken: upvoteToken,
        downvoteToken: downvoteToken,

        // keep listened message consistent after bot shutdown
        listenMessage: {}
    }), 'utf8');
}

const guildReset = (guildId) => {
    if (isSetup(guildId)) {
        const guildDataPath = path.join(global.dirname, 'modules/auto-reactor/config', `${guildId}.json`);
        fs.unlinkSync(guildDataPath);
    }
}

const getTokenName = (token) => {
    const start = token.indexOf(':') + 1;
    const end = token.lastIndexOf(':');

    if (start >= 0 && end > start) {
        return token.slice(start, end);
    }
    return token;
}

const getTokenId = (token) => {
    const start = token.lastIndexOf(':') + 1;
    const end = token.lastIndexOf('>');

    if (start >= 0 && end > start) {
        return token.slice(start, end);
    }
    return token;
}

let listenMessage = {};

const isListened = (guildId, messageId) => {
    if (!listenMessage[guildId]) return false;
    return listenMessage[guildId].hasOwnProperty(messageId);
}

const addMessage = (guildId, messageId) => {
    if (!listenMessage[guildId]) {
        listenMessage[guildId] = {};
    }
    listenMessage[guildId][messageId] = 1;
}

const removeMessage = (msg) => {
    const guildId = msg.guild.id,
        channelId = msg.channel.id,
        messageId = msg.id;
    if (isInRoom(guildId, channelId)) {
        if (isListened(guildId, messageId)) {
            // Remove message ID from RAM
            if (listenMessage[guildId]) {
                listenMessage[guildId][messageId] = null;
                delete listenMessage[guildId][messageId];
                if (Object.keys(listenMessage[guildId]).length === 0) {
                    listenMessage[guildId] = null;
                    delete listenMessage[guildId];
                }
            }

            // Remove message ID from configuration file
            let guildData = loadGuildFile(guildId);
            guildData.listenMessage[messageId] = null;
            delete guildData.listenMessage[messageId];
            writeGuildFile(guildId, guildData);
        }
    }
}

const flushGuild = (guildId) => {
    if (listenMessage[guildId]) {
        listenMessage[guildId] = null;
        delete listenMessage[guildId];
    }
    let guildData = loadGuildFile(guildId);
    guildData.listenMessage = {};
    writeGuildFile(guildId, guildData);
}

const initialiseInput = (msg) => {
    if (isInRoom(msg.guild.id, msg.channel.id)) {
        if (isPrefix(msg.content, "suggest") || isPrefix(msg.content, "vote")) {
            let guildData = loadGuildFile(msg.guild.id);
            try {
                msg.react(guildData.upvoteToken);
                msg.react(guildData.downvoteToken);

                if (!listenMessage[msg.guild.id])
                    listenMessage[msg.guild.id] = {};

                // Store listening message ID in RAM
                listenMessage[msg.guild.id][msg.id] = 1;

                // Store listening message ID in configuration file
                guildData.listenMessage[msg.id] = 1;
                writeGuildFile(msg.guild.id, guildData);
            } catch (error) {
                console.error(error);
            }
        }
    }
}

module.exports = {
    isSetup,
    loadGuildFile,
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
    initialiseInput
}
