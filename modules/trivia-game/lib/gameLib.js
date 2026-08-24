const { db } = global.customLib;
const { prisma, redisClient } = db;
const fs = require('node:fs');
const path = require('node:path');
const { dirname } = global.variable;

// Database
const raw_easy_boolean = JSON.parse(fs.readFileSync(path.join(dirname, 'modules/trivia-game/database/boolean.easy.database.min.json'), 'utf-8'));
const raw_medium_boolean = JSON.parse(fs.readFileSync(path.join(dirname, 'modules/trivia-game/database/boolean.medium.database.min.json'), 'utf-8'));
const raw_hard_boolean = JSON.parse(fs.readFileSync(path.join(dirname, 'modules/trivia-game/database/boolean.hard.database.min.json'), 'utf-8'));
const raw_easy_multiple = JSON.parse(fs.readFileSync(path.join(dirname, 'modules/trivia-game/database/multiple.easy.database.min.json'), 'utf-8'));
const raw_medium_multiple = JSON.parse(fs.readFileSync(path.join(dirname, 'modules/trivia-game/database/multiple.medium.database.min.json'), 'utf-8'));
const raw_hard_multiple = JSON.parse(fs.readFileSync(path.join(dirname, 'modules/trivia-game/database/multiple.hard.database.min.json'), 'utf-8'));

const easy_med_list = [].concat(raw_easy_boolean.results, raw_easy_multiple.results, raw_medium_boolean.results, raw_medium_multiple.results);
const hard_list = [].concat(raw_hard_boolean.results, raw_hard_multiple.results);

const MODULE_NAME = 'trivia-game';

// Configuration
const penalty = {
    boolean: { easy: { up: 1, down: -2 }, medium: { up: 2, down: -2 }, hard: { up: 3, down: -2 } },
    multiple: { easy: { up: 2, down: -2 }, medium: { up: 3, down: -2 }, hard: { up: 4, down: -2 } }
};

const timeAllowed = {
    easy: 10,
    medium: 15,
    hard: 20
};

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

const guildSetup = async (guildId, channelId) => {
    if (await isSetup(guildId)) return;
    await saveGuildConfig(guildId, {
        room: channelId,
        playerdata: {}
    });
};

const guildUninstall = async (guildId) => {
    if (!(await isSetup(guildId))) return;
    await prisma.guildConfig.delete({
        where: { guildId_module: { guildId, module: MODULE_NAME } }
    });
    await redisClient.del(`config:${MODULE_NAME}:${guildId}`);
    await redisClient.del(`running:${MODULE_NAME}:${guildId}`);
};

const guildReset = async (guildId) => {
    const guildData = await getGuildConfig(guildId);
    if (!guildData) return;
    guildData.playerdata = {};
    await saveGuildConfig(guildId, guildData);
};

const getRoomId = async (guildId) => {
    const config = await getGuildConfig(guildId);
    return config ? config.room : null;
};

const isInRoom = async (guildId, channelId) => {
    const roomId = await getRoomId(guildId);
    return roomId === channelId;
};

const resetRoomId = async (guildId, newChannelId) => {
    const guildData = await getGuildConfig(guildId);
    if (!guildData) return;
    guildData.room = newChannelId;
    await saveGuildConfig(guildId, guildData);
};

// ingame tasks
const getTimeAllowed = (diff) =>
    timeAllowed.hasOwnProperty(diff) ? timeAllowed[diff] : 0;

const getPenalty = (type, diff) =>
    penalty.hasOwnProperty(type) ? penalty[type].hasOwnProperty(diff) ? penalty[type][diff] : null : null;

// game states getters/setters (Ephemeral in Redis)
const isRunning = async (guildId) => {
    if (!(await isSetup(guildId))) return false;
    const running = await redisClient.get(`running:${MODULE_NAME}:${guildId}`);
    return running === '1';
};

const guildLock = async (guildId) => {
    await redisClient.set(`running:${MODULE_NAME}:${guildId}`, '1');
};

const guildUnlock = async (guildId) => {
    await redisClient.del(`running:${MODULE_NAME}:${guildId}`);
};

// database getters
const easyReader = () => easy_med_list.randomValue();
const hardReader = () => hard_list.randomValue();

// player data getters
const hasPlayerData = async (guildId, userId) => {
    const config = await getGuildConfig(guildId);
    return config && config.playerdata ? config.playerdata.hasOwnProperty(userId) : false;
};

const allPlayerList = async (guildId) => {
    const config = await getGuildConfig(guildId);
    return config && config.playerdata ? Object.keys(config.playerdata) : [];
};

const readPlayerScore = async (guildId, userId) => {
    const config = await getGuildConfig(guildId);
    return config && config.playerdata && config.playerdata[userId] ? config.playerdata[userId].score : null;
};

// player data setters
const bulkSaveInstaceResult = async (guildId, gameResultData, type, diff) => {
    if (!(await isSetup(guildId))) return;

    const winPenalty = penalty[type][diff].up;
    const losePenalty = penalty[type][diff].down;

    const guildData = await getGuildConfig(guildId);
    if (!guildData) return;
    if (!guildData.playerdata) guildData.playerdata = {};

    gameResultData.win.forEach(userId => {
        if (guildData.playerdata[userId]) {
            if (guildData.playerdata[userId].score && guildData.playerdata[userId].score.length > 0) {
                guildData.playerdata[userId].score.push(guildData.playerdata[userId].score.lastValue() + winPenalty);
            } else {
                guildData.playerdata[userId].score = [0, winPenalty];
            }
        } else {
            guildData.playerdata[userId] = { score: [0, winPenalty] };
        }
    });

    gameResultData.lose.forEach(userId => {
        if (guildData.playerdata[userId]) {
            if (guildData.playerdata[userId].score && guildData.playerdata[userId].score.length > 0) {
                guildData.playerdata[userId].score.push(guildData.playerdata[userId].score.lastValue() + losePenalty);
            } else {
                guildData.playerdata[userId].score = [0, losePenalty];
            }
        } else {
            guildData.playerdata[userId] = { score: [0, losePenalty] };
        }
    });

    await saveGuildConfig(guildId, guildData);
};

module.exports = {
    isSetup,
    getGuildConfig,
    guildSetup,
    guildUninstall,
    guildReset,
    getRoomId,
    isInRoom,
    resetRoomId,

    getTimeAllowed,
    getPenalty,
    isRunning,
    guildLock,
    guildUnlock,
    easyReader,
    hardReader,
    hasPlayerData,
    allPlayerList,
    readPlayerScore,
    bulkSaveInstaceResult
};