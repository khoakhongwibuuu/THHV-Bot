// Packages
const fs = require('fs');
const path = require('path');

// In-memory author ID of cached messages
let cachedAuthorId = {};
/*
cachedAuthorId = {
    "guild-id-1": {
        "channel-id-1": {
            "message-id-1": "author-id-1",
            "message-id-2": "author-id-2",
            ...
        },
         "channel-id-2": {
            "message-id-1": "author-id-1",
            "message-id-2": "author-id-2",
            ...
        },
        ...
    },
    "guild-id-2": {
        "channel-id-1": {
            "message-id-1": "author-id-1",
            "message-id-2": "author-id-2",
            ...
        },
         "channel-id-2": {
            "message-id-1": "author-id-1",
            "message-id-2": "author-id-2",
            ...
        },
        ...
    },
}
*/

// Ultility to get the guild config file path
const getGuildFilePath = (guildId) =>
    path.join(global.dirname, 'modules/react-2-pin/config', `${guildId}.json`);


// Guild and channel checkers
const isSetup = (guildId) =>
    cachedAuthorId.hasOwnProperty(guildId);

const isInRoom = (guildId, channelId) => {
    if (!isSetup(guildId)) return false;
    return cachedAuthorId[guildId].hasOwnProperty(channelId);
};

// File operations
const loadGuildFile = (guildId) => {
    if (!isSetup(guildId)) return null;
    return JSON.parse(fs.readFileSync(getGuildFilePath(guildId), 'utf-8'));
};

const writeGuildFile = (guildId, newData) => {
    if (!isSetup(guildId)) return;
    fs.writeFileSync(getGuildFilePath(guildId), JSON.stringify(newData), 'utf8');
};

// Module startup
const preLoad = (guildId) => {
    const guildData = loadGuildFile(guildId);
    cachedAuthorId[guildId] = guildData;
}

// Include a channelId to the list of tracked channels
const includeChannel = (guildId, channelId) => {
    if (!isSetup(guildId)) {
        // This guild has not been initialised yet
        cachedAuthorId[guildId] = {};
    }
    if (cachedAuthorId[guildId].hasOwnProperty(channelId)) {
        // This channel is already being tracked
        return false;
    }
    cachedAuthorId[guildId][channelId] = {};

    // Write to the guild configuration file
    writeGuildFile(guildId, cachedAuthorId[guildId]);
    return true;
}

// Exclude a channelId from the list of tracked channels
const excludeChannel = (guildId, channelId) => {
    if (!isSetup(guildId)) return false;
    if (!cachedAuthorId[guildId].hasOwnProperty(channelId)) {
        // This channel is not being tracked
        return false;
    }
    delete cachedAuthorId[guildId][channelId];

    // Write to the guild configuration file
    writeGuildFile(guildId, cachedAuthorId[guildId]);

    // remove the guildid config file if all channels are removed
    if (Object.keys(cachedAuthorId[guildId]).length === 0) {
        delete cachedAuthorId[guildId];
        fs.unlinkSync(getGuildFilePath(guildId));
    }

    return true;
}

// View all tracked channels
const viewAllChannels = (guildId) => {
    if (!isSetup(guildId)) return null;
    return Object.keys(cachedAuthorId[guildId]);
}

// Handle pin request
const handleRequest = async (reaction, user) => {
    if (user.bot || user.system) return;

    // Ensure the reaction is fully cached
    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (err) {
            return;
        }
    }

    // Filter
    if (reaction.emoji.name !== '📌') return;
    if (!isSetup(reaction.message.guild.id)) return;
    if (!isInRoom(reaction.message.guild.id, reaction.message.channel.id)) return;

}

module.exports = {

}