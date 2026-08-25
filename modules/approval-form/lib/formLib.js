const discordAPIv2 = require('#assets/api/discord.api.v2.js');
const db = require('#assets/library/db.js');
const { prisma, redisClient } = db;

const MODULE_NAME = 'approval-form';

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

// Installation-Uninstallation
const guildSetup = async (guildId, data) => {
    if (await isSetup(guildId)) return false;
    await saveGuildConfig(guildId, data);
    return true;
};

const guildUninstall = async (guildId) => {
    if (!(await isSetup(guildId))) return false;
    
    await prisma.guildConfig.delete({
        where: { guildId_module: { guildId, module: MODULE_NAME } }
    });
    await redisClient.del(`config:${MODULE_NAME}:${guildId}`);
    await redisClient.del(`cache:${MODULE_NAME}:${guildId}`);
    
    return true;
};

const isUninstallable = async (guildId) => {
    const config = await getGuildConfig(guildId);
    if (!config) return false;
    
    const usage = await usageData(guildId);
    return usage.length === 0 && Object.keys(config.waitApproval || {}).length === 0;
};

const memberIsVerified = async (guildId, userId) => {
    const config = await getGuildConfig(guildId);
    if (!config) return false;
    
    const member = await discordAPIv2.GuildMember(guildId, userId);
    return member.roles.cache.has(config.role);
};

// --- WAIT APPROVAL QUEUE (Persistent - DB) ---

const addMemberToApprovalQueue = async (guildId, userId) => {
    const config = await getGuildConfig(guildId);
    if (config) {
        config.waitApproval = config.waitApproval || {};
        config.waitApproval[userId] = 1;
        await saveGuildConfig(guildId, config);
    }
};

const removeMemberFromApprovalQueue = async (guildId, userId) => {
    const config = await getGuildConfig(guildId);
    if (config && config.waitApproval && config.waitApproval[userId]) {
        delete config.waitApproval[userId];
        await saveGuildConfig(guildId, config);
    }
};

const memberIsInApprovalQueue = async (guildId, userId) => {
    const config = await getGuildConfig(guildId);
    return config && config.waitApproval && config.waitApproval[userId] ? true : false;
};

// --- RUNTIME EPHEMERAL STATE (Redis Sets) ---

const addMemberToCache = async (guildId, userId) => {
    if (await isSetup(guildId)) {
        await redisClient.sAdd(`cache:${MODULE_NAME}:${guildId}`, userId);
    }
};

const removeMemberFromCache = async (guildId, userId) => {
    if (await isSetup(guildId)) {
        await redisClient.sRem(`cache:${MODULE_NAME}:${guildId}`, userId);
    }
};

const memberIsInCache = async (guildId, userId) => {
    if (!(await isSetup(guildId))) return false;
    return await redisClient.sIsMember(`cache:${MODULE_NAME}:${guildId}`, userId);
};

const usageData = async (guildId) => {
    if (!(await isSetup(guildId))) return [];
    return await redisClient.sMembers(`cache:${MODULE_NAME}:${guildId}`);
};

module.exports = {
    isSetup,
    guildSetup,
    guildUninstall,
    isUninstallable,
    getGuildConfig,
    memberIsVerified,
    addMemberToApprovalQueue,
    removeMemberFromApprovalQueue,
    memberIsInApprovalQueue,
    addMemberToCache,
    removeMemberFromCache,
    memberIsInCache,
    usageData
};