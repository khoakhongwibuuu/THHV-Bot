// Packages
const fs = require('fs');
const path = require('path');

// Universal
const dirname = global.dirname;
const stdlib = global.stdlib;
const discordAPI = global.discordAPI;

const persistPath = path.join(dirname, 'modules/codeforces-contest/config/persist.json');

// Persist Controller
const loadPersist = () => { return JSON.parse(fs.readFileSync(persistPath, 'utf8')); }
const savePersist = (Persist) => { fs.writeFileSync(persistPath, JSON.stringify(Persist)); }
const wipePersist = () => {
    fs.writeFileSync(persistPath, JSON.stringify({
        ready: {},
        channel: {},
        role: {},
        forum: {}
    }));
};

// Lib validation
const validateLib = () => { return true }

module.exports = {
    loadPersist,
    savePersist,
    wipePersist,
    validateLib
};