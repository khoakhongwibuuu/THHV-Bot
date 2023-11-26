// Special Library
const fs = require('fs');

// Basic
const client = global.client;
const Utils = global.Utils;
const dirname = global.dirname;

// File paths
const playerDataPath = dirname + '/configs/playerData.json';
const settingPath = dirname + '/configs/gameSetting.json';
const modulesPath = dirname + '/configs/modules.json';

// In cases when playerdata.json, game.json and modules.json are manually deleted
if (!fs.existsSync(playerDataPath)) {
    fs.writeFileSync(playerDataPath, JSON.stringify({}));
}

if (!fs.existsSync(settingPath)) {
    fs.writeFileSync(settingPath, JSON.stringify({
        ETA: 10,
        up: 2,
        down: -3,
        mode: {
            easy: 0,
            medium: 5,
            hard: 10
        }
    }, null, 4));
}

if (!fs.existsSync(modulesPath)) {
    fs.writeFileSync(modulesPath, JSON.stringify({
        running: false,
        enabled: {
            main: true,
            export: true,
            graph: true,
            reset: true,
            score: true
        }
    }, null, 4));
}

// Basic game features
const decoder = (str) => {
    return decodeURIComponent(str);
}

const shuffle = (array) => {
    for (let x = 0; x < (array.length) * (array.length); x++) {
        let i = Utils.clockBasedRandom(0, array.length - 1);
        let j = Utils.clockBasedRandom(0, array.length - 1);
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const keyCompiler = (key, mode) => {
    if (key === '🇦') {
        if (mode === "multiple")
            return "A"
        else return "True";
    }
    if (key === '🇧') {
        if (mode === "multiple")
            return "B"
        else return "False";
    }
    if (key === '🇨') return "C"
    if (key === '🇩') return "D"
}

// API for playerdata.json
const saveScore = (userID, penalty) => {
    userID = userID.toString();
    const playerdata = JSON.parse(fs.readFileSync(playerDataPath, 'utf8'));
    if (!playerdata.hasOwnProperty(userID))
        playerdata[userID] = [0, penalty];
    else if (!playerdata[userID].length > 0)
        playerdata[userID].push(0, penalty);
    else
        playerdata[userID].push(playerdata[userID][playerdata[userID].length - 1] + penalty);
    fs.writeFileSync(playerDataPath, JSON.stringify(playerdata));
}

const readScore = (userID) => {
    userID = userID.toString();
    const playerdata = JSON.parse(fs.readFileSync(playerDataPath, 'utf8'));
    return (playerdata.hasOwnProperty(userID)) && playerdata[userID].length > 0 ? playerdata[userID] : "Unknown";
}

const resetScore = (userID) => {
    userID = userID.toString();
    const playerdata = JSON.parse(fs.readFileSync(playerDataPath, 'utf8'));
    delete playerdata[userID];
    fs.writeFileSync(playerDataPath, JSON.stringify(playerdata));
}

const allDataDelete = () => {
    const playerdata = JSON.parse(fs.readFileSync(playerDataPath, 'utf8'));
    Object.keys(playerdata).forEach(key => delete playerdata[key]);
    fs.writeFileSync(playerDataPath, JSON.stringify(playerdata));
}

// API for game status
const unlock = () => {
    const status = JSON.parse(fs.readFileSync(modulesPath, 'utf8'));
    if (status.running === true) {
        status.running = false;
        fs.writeFileSync(modulesPath, JSON.stringify(status, null, 4));
    }
}

const lock = () => {
    const status = JSON.parse(fs.readFileSync(modulesPath, 'utf8'));
    if (status.running === false) {
        status.running = true;
        fs.writeFileSync(modulesPath, JSON.stringify(status, null, 4));
    }
}

const loadStatus = () => {
    return JSON.parse(fs.readFileSync(modulesPath, 'utf8')).running;
}

// API for game setting
const loadSetting = () => {
    return JSON.parse(fs.readFileSync(settingPath, 'utf8'));
}

// API for game modules availability
const loadModulesAvailability = () => {
    return JSON.parse(fs.readFileSync(modulesPath, 'utf8'));
}

// Exports
module.exports.decoder = decoder;
module.exports.shuffle = shuffle;
module.exports.keyCompiler = keyCompiler;

module.exports.saveScore = saveScore;
module.exports.readScore = readScore;
module.exports.resetScore = resetScore;
module.exports.allDataDelete = allDataDelete;

module.exports.unlock = unlock;
module.exports.lock = lock;

module.exports.loadStatus = loadStatus;
module.exports.loadSetting = loadSetting;
module.exports.loadModulesAvailability = loadModulesAvailability;