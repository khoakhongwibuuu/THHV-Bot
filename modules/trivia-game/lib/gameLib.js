// Packages
const fs = require('node:fs');
const path = require('node:path');
const { dirname } = global.variable;

// Database
const qsDB = JSON.parse(fs.readFileSync(path.join(dirname, 'modules/trivia-game/database/processed.database.min.json'), 'utf-8'));
const booleanDB = qsDB.results.filter(qs => qs.type === 'boolean');
const multiDB = qsDB.results.filter(qs => qs.type === 'multiple');

const getGuildFilePath = (guildId) => path.join(dirname, "modules/trivia-game/config", `${guildId}.json`);

const penalty = {
    boolean: { easy: { up: 2, down: -2 }, medium: { up: 3, down: -2 }, hard: { up: 4, down: -2 } },
    multiple: { easy: { up: 2, down: -2 }, medium: { up: 3, down: -2 }, hard: { up: 4, down: -2 } }
}

const timeAllowed = {
    easy: 10,
    medium: 15,
    hard: 20
}

let guildState = {};

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

const preLoad = (guildId) => {
    const guildData = loadGuildFile(guildId);
    guildState[guildId] = {
        room: guildData.room,
        running: false
    }
}

const getRoom = (guildId) =>
    isSetup(guildId) ? guildState[guildId].room : null;

const isInRoom = (guildId, testChannelId) =>
    isSetup(guildId) ? getRoom(guildId) === testChannelId : false;


const resetRoomId = (guildId, newChannelId) => {
    if (!isSetup(guildId)) return;
    guildState[guildId].room = newChannelId;
    const guildData = loadGuildFile(guildId);
    guildData.room = newChannelId;
    writeGuildFile(guildId, guildData);
}

// ingame tasks
const getTimeAllowed = (diff) =>
    timeAllowed.hasOwnProperty(diff) ? timeAllowed[diff] : 0;

const getPenalty = (type, diff) =>
    penalty.hasOwnProperty(type) ? penalty[type].hasOwnProperty(diff) ? penalty[type][diff] : null : null;

const hasPlayerData = (guildId, userId) =>
    loadGuildFile(guildId).playerdata.hasOwnProperty(userId)

const allPlayerList = (guildId) =>
    isSetup(guildId) ? Object.keys(loadGuildFile(guildId).playerdata) : [];

const readPlayerScore = (guildId, userId) =>
    isSetup(guildId) ? hasPlayerData(guildId, userId) ? loadGuildFile(guildId).playerdata[userId].score : null : null;

const bulkSaveInstaceResult = (guildId, gameResultData, type, diff) => {
    // gameResultData = {
    //     win: [..usr_id],
    //     lose: [..usr_id],
    // }

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

const bulkPlayerReset = (guildId) => {
    const guildData = loadGuildFile(guildId);
    guildData.playerdata = {}
    writeGuildFile(guildId, guildData);
}

const isRunning = (guildId) =>
    isSetup(guildId) ? guildState[guildId].running : false;


const guildLock = (guildId) =>
    guildState[guildId].running = true;


const guildUnlock = (guildId) =>
    guildState[guildId].running = false;


const booleanReader = () =>
    booleanDB.randomValue();


const multipleReader = () =>
    multiDB.randomValue();


module.exports = {
    isSetup,
    loadRawGuildFile,
    loadGuildFile,
    writeGuildFile,
    guildSetup,
    guildUninstall,
    preLoad,
    getRoom,
    isInRoom,
    resetRoomId,
    getTimeAllowed,
    getPenalty,
    hasPlayerData,
    allPlayerList,
    readPlayerScore,
    bulkSaveInstaceResult,
    bulkPlayerReset,
    isRunning,
    guildLock,
    guildUnlock,
    booleanReader,
    multipleReader
}