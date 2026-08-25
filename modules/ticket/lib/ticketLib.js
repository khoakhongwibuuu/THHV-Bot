const db = require('#assets/library/db.js');
const { prisma, redisClient } = db;

const MODULE_NAME = 'ticket';

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

const guildSetup = async (guildId, data) => {
    if (!(await isSetup(guildId))) {
        await saveGuildConfig(guildId, data);
    }
};

const guildUninstall = async (guildId) => {
    if (!(await isSetup(guildId))) return false;
    await prisma.guildConfig.delete({
        where: { guildId_module: { guildId, module: MODULE_NAME } }
    });
    await redisClient.del(`config:${MODULE_NAME}:${guildId}`);
    return true;
};

const getRootChannel = async (guildId) => {
    const config = await getGuildConfig(guildId);
    return config ? config.rootChannel : null;
};

const getExistingTickets = async (guildId) => {
    const config = await getGuildConfig(guildId);
    return config && config.running ? Object.keys(config.running) : [];
};

const isOccupied = async (guildId, userId) => {
    const config = await getGuildConfig(guildId);
    return config && config.running ? Object.values(config.running).includes(userId) : false;
};

const addOccupation = async (guildId, channelId, userId) => {
    const config = await getGuildConfig(guildId);
    if (config) {
        config.running = config.running || {};
        config.running[channelId] = userId;
        await saveGuildConfig(guildId, config);
    }
};

const removeOccupation = async (guildId, channelId) => {
    const config = await getGuildConfig(guildId);
    if (config && config.running && config.running[channelId]) {
        delete config.running[channelId];
        await saveGuildConfig(guildId, config);
    }
};

module.exports = {
    isSetup,
    getGuildConfig,
    guildSetup,
    guildUninstall,
    getRootChannel,
    getExistingTickets,
    isOccupied,
    addOccupation,
    removeOccupation
};