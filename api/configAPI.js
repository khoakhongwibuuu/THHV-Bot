// Special library
const fs = require('fs');

// Basic variables
const Utils = global.Utils;
const dirname = global.dirname;

const configPath = dirname + '/configs/config.json';

if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify({}));
}

const loadRawData = () => {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

const loadLanguage = () => {
    return JSON.parse(fs.readFileSync(dirname + '/langs/' + loadRawData().language + '.json', 'utf-8'));
}

const loadDefaultLanguage = () => {
    return JSON.parse(fs.readFileSync(dirname + '/langs/default.json', 'utf-8'));
}

const overwrite = (key, value) => {
    const excludeList = ['owner', 'notify_hours', 'prefix']
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    if (!excludeList.includes(key))
        config[key] = value;
    fs.writeFileSync(configPath, JSON.stringify(config));
}

const newkey = (key, value) => {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    if (!config.hasOwnProperty(key)) {
        config[key] = value;
        fs.writeFileSync(configPath, JSON.stringify(config));
    }
}

const trust = (userID) => {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    config.owner.push(userID);
    fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
}

const untrust = (userID) => {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    const idx = config.owner.findIndex((id) => { return id === userID });
    if (idx != -1) {
        config.owner.splice(idx, 1);
        fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
    }
}

module.exports.loadRawData = loadRawData;
module.exports.loadLanguage = loadLanguage;
module.exports.loadDefaultLanguage = loadDefaultLanguage;
module.exports.overwrite = overwrite;
module.exports.newkey = newkey;
module.exports.trust = trust;
module.exports.untrust = untrust;