// Packages
const fs = require('fs');
const path = require('path');

// Module based
const qsDB = JSON.parse(fs.readFileSync(path.join(global.dirname, 'modules/multiple-choice/database/processed.database.min.json'), 'utf-8'));
const booleanDB = qsDB.results.filter(qs => qs.type === 'boolean');
const multiDB = qsDB.results.filter(qs => qs.type === 'multiple');

const configDirPath = path.join(global.dirname, "modules/multiple-choice/config");

// Configuration
const LATEST_DATABASE_VERSION = 1;
const BOOST_ID = Object.freeze({
    NONE: 0,
    DOUBLE: 1,
    IMMUNITY: 2
});

// File handling tasks
const isSetup = (guildId) => {
    const guildDataPath = path.join(configDirPath, `${guildId}.json`);
    return fs.existsSync(guildDataPath);
}

const guildSetup = (guildId, channelId) => {
    const guildDataPath = path.join(configDirPath, `${guildId}.json`);
    if (!fs.existsSync(guildDataPath)) {
        const setupData = JSON.stringify({
            version: LATEST_DATABASE_VERSION,
            dateCreated: new Date().getTime(),
            setting: {
                running: false,
                channelId: channelId,
                score: {
                    up: 2,
                    down: -3,
                    boostRate: 0
                },
                time: {
                    base: 10,
                    easy: 0,
                    medium: 5,
                    hard: 10
                },
                roles: {
                    high: "",
                    low: ""
                }
            },
            playerdata: {}
        });
        fs.writeFileSync(guildDataPath, (setupData), 'utf-8');
    }
}

const guildUninstall = (guildId) => {
    if (isSetup(guildId)) {
        const guildDataPath = path.join(configDirPath, `${guildId}.json`);
        fs.unlinkSync(guildDataPath);
    }
}

const loadRawGuildFile = (guildId) => {
    const guildDataPath = path.join(configDirPath, `${guildId}.json`);
    const rawTextFile = fs.readFileSync(guildDataPath, 'utf-8');
    return rawTextFile;
}

const loadGuildFile = (guildId) => {
    // const guildDataPath = path.join(configDirPath, `${guildId}.json`);
    // const rawTextFile = fs.readFileSync(guildDataPath, 'utf-8');
    return JSON.parse(loadRawGuildFile(guildId));
}

const writeGuildFile = (guildId, newData) => {
    const guildDataPath = path.join(configDirPath, `${guildId}.json`);
    const JSONdata = JSON.stringify(newData);
    fs.writeFileSync(guildDataPath, (JSONdata), 'utf8');
}

const getRoomId = (guildId) => {
    if (!isSetup(guildId)) return null;
    else return loadGuildFile(guildId).setting.channelId;
}

const isInRoom = (guildId, testChannelId) => {
    if (!isSetup(guildId)) return false;
    else return (getRoomId(guildId) === testChannelId);
}

const resetRoomId = (guildId, newChannelId) => {
    const guildData = loadGuildFile(guildId);
    guildData.setting.channelId = newChannelId;
    writeGuildFile(guildId, guildData);
}

// updating tasks
const getConfigVersion = (guildData) => {
    if (!guildData.hasOwnProperty("version")) return 0;
    else return guildData.version;
}

const updateOutdatedFiles = (guildId) => {
    const guildData = loadGuildFile(guildId);
    if (getConfigVersion(guildData) < LATEST_DATABASE_VERSION) {
        console.log(`[${new Date().toISOString()}] [INFO] Updating ${guildId}'s MultipleChoice configuration file.`);
        guildData.version = LATEST_DATABASE_VERSION;

        if (!guildData.hasOwnProperty("dateCreated")) // For version 1: Add created timestamp
            guildData.dateCreated = new Date().getTime();

        // future stuffs can be added for scalability

        writeGuildFile(guildId, guildData);
    }
}

// Ingame tasks
const hasPlayerData = (guildId, userId) => {
    const guildData = loadGuildFile(guildId);
    return guildData.playerdata.hasOwnProperty(userId);
}

const allPlayerList = (guildId) => {
    let res = []
    const guildData = loadGuildFile(guildId);
    for (let key in guildData.playerdata)
        res.push(key);
    return res;
}

const readPlayerScore = (guildId, userId) => {
    const guildData = loadGuildFile(guildId);
    return hasPlayerData(guildId, userId) ? guildData.playerdata[userId].score : null;
}

const readPlayerBoost = (guildId, userId) => {
    const guildData = loadGuildFile(guildId);
    return hasPlayerData(guildId, userId) ? guildData.playerdata[userId].auxiliary : 0;
}

const bulkSaveInstaceResult = (guildId, gameResultData) => {
    // gameResultData MUST follow this pattern
    // gameResultData = {
    //     win: [..arr_of_usr_id],
    //     doubleWin: [..arr_of_usr_id],
    //     lose: [..arr_of_usr_id],
    //     immune: [..arr_of_usr_id]
    //     boostReceiver: {
    //          playerId: <PLAYER_ID> (can be a string of number or NULL value),
    //          boostId:<BOOST_ID> (integer value: 0<=BOOST_ID<=2)
    //     }
    // }

    const guildData = loadGuildFile(guildId);

    let winPenalty = guildData.setting.score.up;
    let losePenalty = guildData.setting.score.down;

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
                auxiliary: 0,
                score: [0, winPenalty]
            }
        }
    });

    gameResultData.doubleWin.forEach(userId => {
        // THESE PLAYERS WILL LOSE THEIR BOOSTS, SINCE THEY'VE USED THEM
        if (hasPlayerData(guildId, userId)) {
            if (guildData.playerdata[userId].hasOwnProperty("score")) {
                if (guildData.playerdata[userId].score.length > 0) {
                    guildData.playerdata[userId].score.push(guildData.playerdata[userId].score.lastValue() + winPenalty * 2);
                } else {
                    guildData.playerdata[userId].score.push(0, winPenalty * 2);
                }
            } else {
                guildData.playerdata[userId].score = [0, winPenalty * 2];
            }
            guildData.playerdata[userId].auxiliary = 0;
        } else {
            guildData.playerdata[userId] = {
                auxiliary: 0,
                score: [0, winPenalty * 2]
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
                auxiliary: 0,
                score: [0, losePenalty]
            }
        }
    });

    gameResultData.immune.forEach(userId => {
        // THESE PLAYERS WILL LOSE THEIR BOOSTS, SINCE THEY'VE USED THEM
        if (hasPlayerData(guildId, userId)) {
            if (guildData.playerdata[userId].hasOwnProperty("score")) {
                if (guildData.playerdata[userId].score.length > 0) {
                    guildData.playerdata[userId].score.push(guildData.playerdata[userId].score.lastValue());
                } else {
                    guildData.playerdata[userId].score.push(0, 0);
                }
            } else {
                guildData.playerdata[userId].score = [0, 0];
            }
            guildData.playerdata[userId].auxiliary = 0;
        } else {
            guildData.playerdata[userId] = {
                auxiliary: 0,
                score: [0, 0]
            }
        }
    });

    if (gameResultData.boostReceiver.boostId != 0) {
        guildData.playerdata[gameResultData.boostReceiver.playerId].auxiliary = gameResultData.boostReceiver.boostId;
    }

    writeGuildFile(guildId, guildData);
}

const bulkPlayerReset = (guildId) => {
    const guildData = loadGuildFile(guildId);
    guildData.playerdata = {}
    writeGuildFile(guildId, guildData);
}

const bulkBoostLoad = (guildId) => {
    const guildData = loadGuildFile(guildId);
    const immunity = [], doubleReward = [];
    for (const [playerId, playerObj] of Object.entries(guildData.playerdata)) {
        if (playerObj.auxiliary === BOOST_ID.IMMUNITY) immunity.push(playerId);
        if (playerObj.auxiliary === BOOST_ID.DOUBLE) doubleReward.push(playerId);
    }
    return {
        immunity: immunity,
        doubleReward: doubleReward
    }
}

const isRunning = (guildId) => {
    const guildData = loadGuildFile(guildId);
    return guildData.setting.running;
}

const guildLock = (guildId) => {
    const guildData = loadGuildFile(guildId);
    guildData.setting.running = true;
    writeGuildFile(guildId, guildData);
}

const guildUnlock = (guildId) => {
    const guildData = loadGuildFile(guildId);
    guildData.setting.running = false;
    writeGuildFile(guildId, guildData);
}

const booleanReader = () => {
    return booleanDB.randomValue();
}

const multipleReader = () => {
    return multiDB.randomValue();
}

// Boosting mechanics
const boostModuleEnabled = (guildId) => {
    const guildData = loadGuildFile(guildId);
    return !(guildData.setting.score.boostRate === 0);
}

const boostModuleToggle = (guildId) => {
    const guildData = loadGuildFile(guildId);
    guildData.setting.score.boostRate = (5 - guildData.setting.score.boostRate);
    writeGuildFile(guildId, guildData);
}

module.exports = {
    isSetup,
    guildSetup,
    guildUninstall,
    loadRawGuildFile,
    loadGuildFile,
    writeGuildFile,
    getRoomId,
    isInRoom,
    resetRoomId,
    updateOutdatedFiles,
    hasPlayerData,
    allPlayerList,
    readPlayerScore,
    readPlayerBoost,
    bulkSaveInstaceResult,
    bulkPlayerReset,
    bulkBoostLoad,
    isRunning,
    guildLock,
    guildUnlock,
    booleanReader,
    multipleReader,
    boostModuleEnabled,
    boostModuleToggle
}