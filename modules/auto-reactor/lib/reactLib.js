const db = require('#assets/library/db.js');
const { prisma, redisClient } = db;

const MODULE_NAME = 'auto-reactor';

// --- CONFIGURATION CACHE (Prisma + Redis) ---

const getGuildConfig = async (guildId) => {
    const cached = await redisClient.get(`config:${MODULE_NAME}:${guildId}`);
    if (cached) return JSON.parse(cached);

    const record = await prisma.guildConfig.findUnique({
        where: { guildId_module: { guildId, module: MODULE_NAME } }
    });

    if (record) {
        await redisClient.set(`config:${MODULE_NAME}:${guildId}`, JSON.stringify(record.data));
        return record.data;
    }
    return null;
};

const saveGuildConfig = async (guildId, data) => {
    await prisma.guildConfig.upsert({
        where: { guildId_module: { guildId, module: MODULE_NAME } },
        update: { data },
        create: { guildId, module: MODULE_NAME, data }
    });
    await redisClient.set(`config:${MODULE_NAME}:${guildId}`, JSON.stringify(data));
};

const isSetup = async (guildId) => {
    const config = await getGuildConfig(guildId);
    return config !== null;
};

const flushGuild = async (guildId) => {
    const config = await getGuildConfig(guildId);
    if (config) {
        config.listenMessage = {};
        await saveGuildConfig(guildId, config);
    }
};

const guildSetup = async (guildId, channelId, upvoteToken, downvoteToken) => {
    await saveGuildConfig(guildId, {
        channelId,
        upvoteToken,
        downvoteToken,
        listenMessage: {}
    });
};

const guildReset = async (guildId) => {
    if (await isSetup(guildId)) {
        await prisma.guildConfig.delete({
            where: { guildId_module: { guildId, module: MODULE_NAME } }
        });
        await redisClient.del(`config:${MODULE_NAME}:${guildId}`);
    }
};

const isInRoom = async (guildId, channelId) => {
    const config = await getGuildConfig(guildId);
    return config ? config.channelId === channelId : false;
};

const isPrefix = (str, prefix) => str.toLowerCase().startsWith(prefix.toLowerCase());

const isListened = async (guildId, messageId) => {
    const config = await getGuildConfig(guildId);
    return config && config.listenMessage && config.listenMessage[messageId] ? true : false;
};

const getTokenName = (token) => {
    const start = token.indexOf(':') + 1;
    const end = token.lastIndexOf(':');
    if (start >= 0 && end > start) return token.slice(start, end);
    return token;
};

const getTokenId = (token) => {
    const start = token.lastIndexOf(':') + 1;
    const end = token.lastIndexOf('>');
    if (start >= 0 && end > start) return token.slice(start, end);
    return token;
};

const initialiseInput = async (msg) => {
    if (!msg || !msg.guild || !msg.guild.id || !msg.channel || !msg.channel.id) return;
    if (!(await isInRoom(msg.guild.id, msg.channel.id))) return;
    if (!isPrefix(msg.content, "suggest") && !isPrefix(msg.content, "vote")) return;

    const config = await getGuildConfig(msg.guild.id);
    if (!config) return;

    try {
        await msg.react(config.upvoteToken);
        await msg.react(config.downvoteToken);

        config.listenMessage = config.listenMessage || {};
        config.listenMessage[msg.id] = 1;
        await saveGuildConfig(msg.guild.id, config);
    } catch (error) {
        console.error(error);
    }
};

const handleReaction = async (reaction, user) => {
    if (!reaction.message.guildId) return;
    if (user.bot || !(await isListened(reaction.message.guildId, reaction.message.id))) return;

    try {
        await reaction.message.fetch();
        const config = await getGuildConfig(reaction.message.guildId);
        if (!config) return;

        const { upvoteToken, downvoteToken } = config;
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
};

const removeMessage = async (msg) => {
    if (!msg || !msg.guild || !msg.guild.id || !msg.channel || !msg.channel.id) return;
    if (!(await isInRoom(msg.guild.id, msg.channel.id))) return;

    if (await isListened(msg.guild.id, msg.id)) {
        const config = await getGuildConfig(msg.guild.id);
        if (config && config.listenMessage && config.listenMessage[msg.id]) {
            delete config.listenMessage[msg.id];
            await saveGuildConfig(msg.guild.id, config);
        }
    }
};

module.exports = {
    isSetup,
    getGuildConfig,
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