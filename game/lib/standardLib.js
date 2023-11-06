const fs = require('fs');
// Basic
const client = global.client;
const Config = global.Config;
const Lang = global.Lang;
const Utils = global.Utils;
const Base_Lang = global.Base_Lang;
const dirname = global.dirname;

const playerDatapath = dirname + '/configs/playerdata.json';

if (!fs.existsSync(playerDatapath)) {
    fs.writeFileSync(playerDatapath, JSON.stringify({}));
}
const saveScore = (userID, penalty) => {
    userID = userID.toString();
    const playerdata = JSON.parse(fs.readFileSync(playerDatapath, 'utf8'));
    if (!playerdata.hasOwnProperty(userID))
        playerdata[userID] = [0, penalty];
    else if (!playerdata[userID].length > 0)
        playerdata[userID].push(0, penalty);
    else
        playerdata[userID].push(playerdata[userID][playerdata[userID].length - 1] + penalty);
    fs.writeFileSync(playerDatapath, JSON.stringify(playerdata));
}

const readScore = (userID) => {
    userID = userID.toString();
    const playerdata = JSON.parse(fs.readFileSync(playerDatapath, 'utf8'));
    return (playerdata.hasOwnProperty(userID)) && playerdata[userID].length > 0 ? playerdata[userID] : "Unknown";
}

const rawdata = () => {
    return fs.readFileSync(playerDatapath, 'utf8');
}

const resetScore = (userID) => {
    userID = userID.toString();
    const playerdata = JSON.parse(fs.readFileSync(playerDatapath, 'utf8'));
    delete playerdata[userID];
    fs.writeFileSync(playerDatapath, JSON.stringify(playerdata));
}

const allDataDelete = () => {
    const playerdata = JSON.parse(fs.readFileSync(playerDatapath, 'utf8'));
    Object.keys(playerdata).forEach(key => delete playerdata[key]);
    fs.writeFileSync(playerDatapath, JSON.stringify(playerdata));
}

const decoder = (str) => {
    return atob(str);
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

module.exports.saveScore = saveScore;
module.exports.readScore = readScore;
module.exports.rawdata = rawdata;
module.exports.resetScore = resetScore;
module.exports.allDataDelete = allDataDelete;
module.exports.decoder = decoder;
module.exports.shuffle = shuffle;
module.exports.keyCompiler = keyCompiler;