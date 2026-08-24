const { db } = global.customLib;
const { prisma, redisClient } = db;

const MODULE_NAME = 'contest';

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
    return config !== null && config.ready === true;
};

const guildSetup = async (guildId, channelId, roleId) => {
    await saveGuildConfig(guildId, {
        ready: true,
        channel: channelId,
        role: roleId || null,
        notified: {}
    });
};

const guildUninstall = async (guildId) => {
    if (!(await isSetup(guildId))) return false;
    await prisma.guildConfig.delete({
        where: { guildId_module: { guildId, module: MODULE_NAME } }
    });
    await redisClient.del(`config:${MODULE_NAME}:${guildId}`);
    return true;
};

const hasBeenNotified = async (guildId, domain, hours, contestId) => {
    const config = await getGuildConfig(guildId);
    if (!config || !config.notified) return false;
    if (!config.notified[domain]) return false;
    if (!config.notified[domain][hours]) return false;
    return config.notified[domain][hours].includes(contestId);
};

const markAsNotified = async (guildId, domain, hours, contestId) => {
    const config = await getGuildConfig(guildId);
    if (config) {
        if (!config.notified) config.notified = {};
        if (!config.notified[domain]) config.notified[domain] = {};
        if (!config.notified[domain][hours]) config.notified[domain][hours] = [];
        
        if (!config.notified[domain][hours].includes(contestId)) {
            config.notified[domain][hours].push(contestId);
            await saveGuildConfig(guildId, config);
        }
    }
};

module.exports = {
    getGuildConfig,
    isSetup,
    guildSetup,
    guildUninstall,
    hasBeenNotified,
    markAsNotified
};