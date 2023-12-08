// Special library
const fs = require('fs');

// Basic variables
const dirname = global.dirname;

const corePath = dirname + '/configs/core.json';

if (!fs.existsSync(corePath)) {
    fs.writeFileSync(corePath, JSON.stringify({
        owner: "",
        trusted: [],
        timezone: 0
    }, null, 4));
}

const load = () => {
    return JSON.parse(fs.readFileSync(corePath, 'utf8'));
}

const overwrite = (key, value) => {
    const excludeList = ['owner']
    const core = JSON.parse(fs.readFileSync(corePath, 'utf-8'));
    if (!excludeList.includes(key))
        core[key] = value;
    fs.writeFileSync(corePath, JSON.stringify(core));
}

const newkey = (key, value) => {
    const core = JSON.parse(fs.readFileSync(corePath, 'utf-8'));
    if (!core.hasOwnProperty(key)) {
        core[key] = value;
        fs.writeFileSync(corePath, JSON.stringify(core));
    }
}

const trust = (userID) => {
    const core = JSON.parse(fs.readFileSync(corePath, 'utf-8'));
    core.trusted.push(userID);
    fs.writeFileSync(corePath, JSON.stringify(core, null, 4));
}

const untrust = (userID) => {
    const core = JSON.parse(fs.readFileSync(corePath, 'utf-8'));
    const idx = core.trusted.findIndex((id) => { return id === userID });
    if (idx != -1) {
        core.trusted.splice(idx, 1);
        fs.writeFileSync(corePath, JSON.stringify(core, null, 4));
    }
}

module.exports.load = load;
module.exports.overwrite = overwrite;
module.exports.newkey = newkey;
module.exports.trust = trust;
module.exports.untrust = untrust;