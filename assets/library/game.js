// Special library
const fs = require('fs');

// Basic variables
const dirname = global.dirname;

const gameSettingPath = dirname + '/configs/gameSetting.json';
if (!fs.existsSync(gameSettingPath)) {
    fs.writeFileSync(gameSettingPath, JSON.stringify({
        enable: true,
        running: false,
        rewardRole: "",
        trashRole: "",
        boostRate: 10,
        time: 12,
        up: 2,
        down: -3,
        mode: {
            easy: 0,
            medium: 5,
            hard: 10
        }
    }, null, 4));
}

const playerDataPath = dirname + '/configs/playerData.json';
if (!fs.existsSync(playerDataPath)) {
    fs.writeFileSync(playerDataPath, JSON.stringify({
        twice: [],
        saver: []
    }));
}

// gameSetting.json
const loadSetting = () => {
    return JSON.parse(fs.readFileSync(gameSettingPath, 'utf8'));
}

const lock = () => {
    const gameSetting = JSON.parse(fs.readFileSync(gameSettingPath, 'utf-8'));
    if (gameSetting.running === false) {
        gameSetting.running = true;
        fs.writeFileSync(gameSettingPath, JSON.stringify(gameSetting, null, 4));
    }
}

const unlock = () => {
    const gameSetting = JSON.parse(fs.readFileSync(gameSettingPath, 'utf-8'));
    if (gameSetting.running === true) {
        gameSetting.running = false;
        fs.writeFileSync(gameSettingPath, JSON.stringify(gameSetting, null, 4));
    }
}

module.exports.loadSetting = loadSetting;
module.exports.lock = lock;
module.exports.unlock = unlock;

// playerData.json
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

const allDataDelete = (mode) => {
    const playerdata = JSON.parse(fs.readFileSync(playerDataPath, 'utf8'));
    if (mode === "score") {
        Object.keys(playerdata).forEach(key => {
            if (key !== "twice" && key !== "saver")
                delete playerdata[key]
        });
    } else if (mode === "boost") {
        playerdata["twice"] = [];
        playerdata["saver"] = [];
    } 
    fs.writeFileSync(playerDataPath, JSON.stringify(playerdata));
}

const readBoost = (type) => {
    return JSON.parse(fs.readFileSync(playerDataPath, 'utf8'))[type];
}

const hasBoost = (userID, type) => {
    return readBoost(type).includes(userID);
}

const addBoost = (userID, type) => {
    const playerdata = JSON.parse(fs.readFileSync(playerDataPath, 'utf8'));
    if (!hasBoost(userID, type)) {
        playerdata[type].push(userID);
        playerdata[type].sort();
        fs.writeFileSync(playerDataPath, JSON.stringify(playerdata));
        return 1;
    } else return 0;
}

const removeBoost = (userID, type) => {
    const playerdata = JSON.parse(fs.readFileSync(playerDataPath, 'utf8'));
    if (hasBoost(userID, type)) {
        const userIndex = readBoost(type).indexOf(userID);
        playerdata[type].splice(userIndex, 1);
        fs.writeFileSync(playerDataPath, JSON.stringify(playerdata));
        return 1;
    } else return 0;
}

module.exports.saveScore = saveScore;
module.exports.readScore = readScore;
module.exports.resetScore = resetScore;
module.exports.allDataDelete = allDataDelete;
module.exports.readBoost = readBoost;
module.exports.hasBoost = hasBoost;
module.exports.addBoost = addBoost;
module.exports.removeBoost = removeBoost;