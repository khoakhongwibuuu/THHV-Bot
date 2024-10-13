// Packages
const fs = require('fs');
const path = require('path');

// Universal
const dirname = global.dirname;
const stdlib = global.stdlib;
const discordAPI = global.discordAPI;

// Configuration
const defaultSettingProfile = (channelId, upvoteToken, downvoteToken) => {
    return {
        // Auto reactor will not be triggered OUTSIDE this channel
        channelId: channelId,

        // UPVOTE and DOWNVOTE token
        upvoteToken: upvoteToken,
        downvoteToken: downvoteToken
    }
}

// Functions
const isSetup = (guildId) => {
    const guildDataPath = path.join(dirname, 'modules/auto-reactor/config', `${guildId}.json`);
    return fs.existsSync(guildDataPath);
}

const loadGuildFile = (guildId) => {
    const guildDataPath = path.join(dirname, 'modules/auto-reactor/config', `${guildId}.json`);
    return JSON.parse(fs.readFileSync(guildDataPath, 'utf-8'));
}

const guildSetup = (guildId, channelId, upvoteToken, downvoteToken) => {
    const guildDataPath = path.join(dirname, 'modules/auto-reactor/config', `${guildId}.json`);
    // allow override in installed guilds
    fs.writeFileSync(guildDataPath, JSON.stringify(defaultSettingProfile(channelId, upvoteToken, downvoteToken)), 'utf8');
}

const guildReset = (guildId) => {
    if (isSetup(guildId)) {
        const guildDataPath = path.join(dirname, 'modules/auto-reactor/config', `${guildId}.json`);
        fs.unlinkSync(guildDataPath);
    }
}

const getRoomId = (guildId) => {
    if (!isSetup(guildId)) return null;
    else return loadGuildFile(guildId).channelId;
}

const isInRoom = (guildId, channelId) => {
    if (!isSetup(guildId)) return false;
    let guildData = loadGuildFile(guildId);
    return (channelId === guildData.channelId)
}

const isPrefix = (str, prefix) => {
    return str.toLowerCase().startsWith(prefix.toLowerCase());
}

const handleInput = (msg) => {
    if (isInRoom(msg.guild.id, msg.channel.id)) {
        if (isPrefix(msg.content, "suggest") || isPrefix(msg.content, "vote")) {
            let guildData = loadGuildFile(msg.guild.id);
            msg.react(guildData.upvoteToken);
            msg.react(guildData.downvoteToken);
        }
    }
}

const handleReaction = (reaction, user) => {
    if (isInRoom(reaction.message.guild.id, reaction.message.channel.id)) {
        const guildData = loadGuildFile(reaction.message.guild.id);
        // Fetch the message if it's a partial
        if (reaction.partial) reaction.fetch();

        // Check if the emoji is ✅ or ❌
        if (reaction.emoji.name !== guildData.upvoteToken && reaction.emoji.name !== guildData.downvoteToken) return;

        // Get all reactions to the message
        const userReactions = reaction.message.reactions.cache.filter(r => r.users.cache.has(user.id));

        // If the user has already reacted with another emoji, remove the current reaction
        for (const r of userReactions.values())
            if (r.emoji.name !== reaction.emoji.name)
                r.users.remove(user.id);
    }
}

module.exports.isSetup = isSetup;
module.exports.loadGuildFile = loadGuildFile;
module.exports.guildSetup = guildSetup;
module.exports.guildReset = guildReset;

module.exports.handleInput = handleInput;
module.exports.handleReaction = handleReaction;