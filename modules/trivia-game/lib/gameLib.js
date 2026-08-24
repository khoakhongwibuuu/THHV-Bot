// Packages
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

// Module based
const configDirPath = path.join(dirname, 'configs/trivia-game/config');
const getGuildFilePath = (guildId) => path.join(configDirPath, `${guildId}.json`);

// Configuration
const penalty = {
    boolean: { easy: { up: 1, down: -2 }, medium: { up: 2, down: -2 }, hard: { up: 3, down: -2 } },
    multiple: { easy: { up: 2, down: -2 }, medium: { up: 3, down: -2 }, hard: { up: 4, down: -2 } }
}

const timeAllowed = {
    easy: 10,
    medium: 15,
    hard: 20
}

// In-memory caching
let guildState = {};

// Functions
const isSetup = (guildId) =>
    guildState.hasOwnProperty(guildId);

const loadRawGuildFile = (guildId) =>
    fs.readFileSync(getGuildFilePath(guildId), 'utf-8');

const loadGuildFile = (guildId) =>
    JSON.parse(loadRawGuildFile(guildId));

const writeGuildFile = (guildId, newData) =>
    fs.writeFileSync(getGuildFilePath(guildId), JSON.stringify(newData), 'utf8');

const guildSetup = (guildId, channelId) => {
    if (isSetup(guildId)) return;

    guildState[guildId] = {
        room: channelId,
        running: false
    };

    writeGuildFile(guildId, {
        room: channelId,
        playerdata: {}
    });
}

const guildUninstall = (guildId) => {
    if (!isSetup(guildId)) return;
    delete guildState[guildId];
    fs.unlinkSync(getGuildFilePath(guildId));
}

const guildReset = (guildId) => {
    if (!isSetup(guildId)) return;
    const guildData = loadGuildFile(guildId);
    guildData.playerdata = {};
    writeGuildFile(guildId, guildData);
}

const getRoomId = (guildId) =>
    isSetup(guildId) ? guildState[guildId].room : null;

const isInRoom = (guildId, channelId) =>
    isSetup(guildId) ? getRoomId(guildId) === channelId : false;


const preLoad = (guildId) => {
    if (!isSetup(guildId)) return;
    const guildData = loadGuildFile(guildId);
    guildState[guildId] = {
        room: guildData.room,
        running: false
    }
}

const resetRoomId = (guildId, newChannelId) => {
    if (!isSetup(guildId)) return;
    guildState[guildId].room = newChannelId;
    const guildData = loadGuildFile(guildId);
    guildData.room = newChannelId;
    writeGuildFile(guildId, guildData);
}

// ingame tasks
/// configuration getters
const getTimeAllowed = (diff) =>
    timeAllowed.hasOwnProperty(diff) ? timeAllowed[diff] : 0;

const getPenalty = (type, diff) =>
    penalty.hasOwnProperty(type) ? penalty[type].hasOwnProperty(diff) ? penalty[type][diff] : null : null;

/// game states getters/setters
const isRunning = (guildId) =>
    isSetup(guildId) ? guildState[guildId].running : false;

const guildLock = (guildId) =>
    guildState[guildId].running = true;

const guildUnlock = (guildId) =>
    guildState[guildId].running = false;

/// database getters
const easyReader = () =>
    easy_med_list.randomValue();

const hardReader = () =>
    hard_list.randomValue();

/// player data getters
const hasPlayerData = (guildId, userId) =>
    isSetup(guildId) ? loadGuildFile(guildId).playerdata.hasOwnProperty(userId) : false;

const allPlayerList = (guildId) =>
    isSetup(guildId) ? Object.keys(loadGuildFile(guildId).playerdata) : [];

const readPlayerScore = (guildId, userId) =>
    isSetup(guildId) ? hasPlayerData(guildId, userId) ? loadGuildFile(guildId).playerdata[userId].score : null : null;

/// player data setters
const bulkSaveInstaceResult = (guildId, gameResultData, type, diff) => {
    // gameResultData = {
    //     win: [..usr_id],
    //     lose: [..usr_id],
    // }

    if (!isSetup(guildId)) return;

    const winPenalty = penalty[type][diff].up;
    const losePenalty = penalty[type][diff].down;

    const guildData = loadGuildFile(guildId);

    gameResultData.win.forEach(userId => {
        if (hasPlayerData(guildId, userId)) {
            if (guildData.playerdata[userId].hasOwnProperty("score")) {
                if (guildData.playerdata[userId].score.length > 0) {
                    guildData.playerdata[userId].score.push(guildData.playerdata[userId].score.lastValue() + winPenalty);
                } else {
                    guildData.playerdata[userId].score.push(0, winPenalty);
                }
            } else {
                guildData.playerdata[userId].score = [0, winPenalty];
            }
        } else {
            guildData.playerdata[userId] = {
                score: [0, winPenalty]
            }
        }
    });

    gameResultData.lose.forEach(userId => {
        if (hasPlayerData(guildId, userId)) {
            if (guildData.playerdata[userId].hasOwnProperty("score")) {
                if (guildData.playerdata[userId].score.length > 0) {
                    guildData.playerdata[userId].score.push(guildData.playerdata[userId].score.lastValue() + losePenalty);
                } else {
                    guildData.playerdata[userId].score.push(0, losePenalty);
                }
            } else {
                guildData.playerdata[userId].score = [0, losePenalty];
            }
        } else {
            guildData.playerdata[userId] = {
                score: [0, losePenalty]
            }
        }
    });

    writeGuildFile(guildId, guildData);
}

module.exports = {
    // Base functions
    isSetup,
    loadRawGuildFile,
    loadGuildFile,
    guildSetup,
    guildUninstall,
    guildReset,
    getRoomId,
    isInRoom,
    preLoad,
    resetRoomId,

    // Ingame tasks
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
}