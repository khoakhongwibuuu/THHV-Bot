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
            try {
                msg.react(guildData.upvoteToken);
                msg.react(guildData.downvoteToken);

                // Create a reaction collector to ensure only one vote per user
                const filter = (reaction, user) => {
                    return [guildData.upvoteToken, guildData.downvoteToken].includes(reaction.emoji.name) && !user.bot;
                };

                const collector = msg.createReactionCollector({ filter, dispose: true });

                collector.on('collect', (reaction, user) => {
                    // Remove the other reaction if the user reacted to both
                    const otherReaction = reaction.emoji.name === guildData.upvoteToken ? guildData.downvoteToken : guildData.upvoteToken;
                    const userReactions = msg.reactions.cache.get(otherReaction);
                    if (userReactions && userReactions.users.cache.has(user.id)) {
                        userReactions.users.remove(user.id);
                    }
                });

                collector.on('remove', (reaction, user) => {

                });

            } catch (error) {

            }
        }
    }
}

module.exports.isSetup = isSetup;
module.exports.loadGuildFile = loadGuildFile;
module.exports.guildSetup = guildSetup;
module.exports.guildReset = guildReset;

module.exports.handleInput = handleInput;
// module.exports.handleReaction = handleReaction;