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

const getGuildFilePath = (guildId) => path.join(dirname, "modules/trivia-game/config", `${guildId}.json`);

const penalty = {
    boolean: { easy: { up: 1, down: -1 }, medium: { up: 2, down: -1 }, hard: { up: 3, down: -1 } },
    multiple: { easy: { up: 2, down: -1 }, medium: { up: 3, down: -1 }, hard: { up: 4, down: -1 } }
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


const easyReader = () =>
    easy_med_list.randomValue();


const hardReader = () =>
    hard_list.randomValue();


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
    easyReader,
    hardReader
}