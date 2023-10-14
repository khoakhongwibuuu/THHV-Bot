const fs = require('fs');
// Basic
const client = global.client;
const Config = global.Config;
const Lang = global.Lang;
const Utils = global.Utils;
const Base_Lang = global.Base_Lang;

const dirname = global.dirname;

// Load player data
const playerDatapath = dirname + '/configs/playerdata.json';

if (!fs.existsSync(playerDatapath)) {
    fs.writeFileSync(playerDatapath, JSON.stringify({}, null, 4));
}
const playerdata = JSON.parse(fs.readFileSync(playerDatapath, 'utf8'));
const savegamedata = () => {
    let sortedArray = Object.entries(playerdata).sort((a, b) => b[1] - a[1]);
    let sortedData = {};
    for (let i = 0; i < sortedArray.length; i++) {
        sortedData[sortedArray[i][0]] = sortedArray[i][1];
    }
    fs.writeFileSync(playerDatapath, JSON.stringify(sortedData, null, 2));
};

const decoder = (str) => {
    let entities = {
        'amp': '&',
        'apos': '\'',
        'lt': '<',
        'gt': '>',
        'quot': '"',
        'Eacute': 'é',
        'Sigma': 'σ',
        'Pi': 'π',
        'Nu': 'ν',
        'Omicron': 'ο',
        'rsquo': '»'
        // add more if needed
    };

    return str.replace(/&([^;]+);/g, function (match, entity) {
        if (entity in entities) {
            return entities[entity];
        } else if (/^#x[\da-fA-F]+$/.test(entity)) {
            return String.fromCharCode(parseInt(entity.slice(2), 16));
        } else if (/^#\d+$/.test(entity)) {
            return String.fromCharCode(Number(entity.slice(1)));
        } else {
            return match;
        }
    });
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
        playerdata[id] = penalty;
    else
        playerdata[id] += penalty;
}

const getUserdata = (userID) => {
    return (playerdata.hasOwnProperty(userID)) ? playerdata[userID] : "Unknown";
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