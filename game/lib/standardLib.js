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
    fs.writeFileSync(playerDatapath, JSON.stringify({}, null, 4));
}

const playerdata = JSON.parse(fs.readFileSync(playerDatapath, 'utf8'));
const savegamedata = () => {
    // let sortedArray = Object.entries(playerdata).sort((a, b) => b[1] - a[1]);
    // let sortedData = {};
    // for (let i = 0; i < sortedArray.length; i++) {
    //     sortedData[sortedArray[i][0]] = sortedArray[i][1];
    // }
    fs.writeFileSync(playerDatapath, JSON.stringify(playerdata, null, 2));
};

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

const saveResult = (id, penalty) => {
    if (!playerdata.hasOwnProperty(id))
        playerdata[id] = [penalty];
    else if (!playerdata[id].length > 0)
        playerdata[id].push(penalty);
    else
        playerdata[id].push(playerdata[id][playerdata[id].length - 1] + penalty);
}

const getUserdata = (userID) => {
    return (playerdata.hasOwnProperty(userID)) && playerdata[userID].length > 0 ? playerdata[userID][playerdata[userID].length - 1] : "Unknown";
}

const isNum = (n) => {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

module.exports.decoder = decoder;
module.exports.shuffle = shuffle;
module.exports.keyCompiler = keyCompiler;
module.exports.saveResult = saveResult;
module.exports.savegamedata = savegamedata;
module.exports.getUserdata = getUserdata;
module.exports.isNum = isNum;