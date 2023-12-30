// Special library
const fs = require('fs');

// Basic variables
const dirname = global.dirname;

const corePath = dirname + '/configs/core.json';

if (!fs.existsSync(corePath)) {
    fs.writeFileSync(corePath, JSON.stringify({
        owner: "671624293674909717",
        trusted: [],
        timezone: 7,
        notificationRole: "",
        notificationHours: [
            1,
            6,
            24
        ]
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

const addHour = (offset) => {
    const core = JSON.parse(fs.readFileSync(corePath, 'utf-8'));
    if (!core.notificationHours.includes(offset)) {
        core.notificationHours.push(offset);
        core.notificationHours.sort((a, b) => { return a - b; });
        fs.writeFileSync(corePath, JSON.stringify(core, null, 4));
        return 0;
    } else return -1;
}

const removeHour = (offset) => {
    const core = JSON.parse(fs.readFileSync(corePath, 'utf-8'));
    const offsetIndex = core.notificationHours.indexOf(offset);
    if (offsetIndex !== -1) {
        core.notificationHours.splice(offsetIndex, 1);
        fs.writeFileSync(corePath, JSON.stringify(core, null, 4));
        return 0;
    } else return -1;
}

module.exports.load = load;
module.exports.overwrite = overwrite;
module.exports.newkey = newkey;
module.exports.trust = trust;
module.exports.untrust = untrust;