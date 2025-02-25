// Packages
const fs = require('fs');
const path = require('path');

// Universal
const dirname = global.dirname;
const stdlib = global.stdlib;
const discordAPI = global.discordAPI;

// Functions
const isSetup = (guildId) => {
    const guildDataPath = path.join(dirname, 'modules/auto-reactor/config', `${guildId}.json`);
    return fs.existsSync(guildDataPath);
}

const loadGuildFile = (guildId) => {
    const guildDataPath = path.join(dirname, 'modules/auto-reactor/config', `${guildId}.json`);
    return JSON.parse(fs.readFileSync(guildDataPath, 'utf-8'));
}

const writeGuildFile = (guildId, newData) => {
    const guildDataPath = path.join(dirname, 'modules/auto-reactor/config', `${guildId}.json`);
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

let listenMessage = {};
// global.listenMessage = listenMessage;

module.exports = {
    isSetup,
    loadGuildFile,
    isInRoom,
    isPrefix,
    addMessage(guildId, messageId) {
        if (!listenMessage[guildId]) {
            listenMessage[guildId] = {};
        }
        listenMessage[guildId][messageId] = 1;
    },
    isListened(guildId, messageId) {
        if (!listenMessage[guildId]) return false;
        return listenMessage.hasOwnProperty(messageId);
    },
    removeMessage(guildId, messageId) {
        if (listenMessage[guildId]) {
            delete listenMessage[guildId][messageId];
            if (Object.keys(listenMessage[guildId]).length === 0) {
                delete listenMessage[guildId];
            }
        }
    },
    guildSetup(guildId, channelId, upvoteToken, downvoteToken) {
        const guildDataPath = path.join(dirname, 'modules/auto-reactor/config', `${guildId}.json`);
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
    },
    guildReset(guildId) {
        if (isSetup(guildId)) {
            const guildDataPath = path.join(dirname, 'modules/auto-reactor/config', `${guildId}.json`);
            fs.unlinkSync(guildDataPath);
        }
    },
    getTokenName(token) {
        const start = token.indexOf(':') + 1;
        const end = token.lastIndexOf(':');

        if (start >= 0 && end > start) {
            return token.slice(start, end);
        }
        return token;
    },
    getTokenId(token) {
        const start = token.lastIndexOf(':') + 1;
        const end = token.lastIndexOf('>');

        if (start >= 0 && end > start) {
            return token.slice(start, end);
        }
        return token;
    },
    initialiseInput(msg) {
        if (isInRoom(msg.guild.id, msg.channel.id)) {
            if (isPrefix(msg.content, "suggest") || isPrefix(msg.content, "vote")) {
                let guildData = loadGuildFile(msg.guild.id);
                try {
                    msg.react(guildData.upvoteToken);
                    msg.react(guildData.downvoteToken);

                    // Store listening message ID in Disk
                    guildData.listenMessage[msg.id] = 1;
                    writeGuildFile(msg.guild.id, guildData);

                    // Store listening message ID in RAM
                    listenMessage[msg.guild.id][msg.id] = 1;
                } catch (error) {
                    console.error(error);
                }
            }
        }
    }
}
