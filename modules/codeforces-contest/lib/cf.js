// Packages
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Universal
const dirname = global.dirname;
const stdlib = global.stdlib;
const discordAPI = global.discordAPI;

const persistPath = path.join(dirname, 'modules/codeforces-contest/config/persist.json');

// Persist Controller
const loadPersist = () => {
    if (!fs.existsSync(persistPath))
        return 0;
    else try {
        const data = JSON.parse(fs.readFileSync(persistPath, 'utf8'));
        return data;
    } catch {
        return -1;
    }
}
const savePersist = (Persist) => { fs.writeFileSync(persistPath, JSON.stringify(Persist)); }
const wipePersist = () => {
    fs.writeFileSync(persistPath, JSON.stringify({
        ready: {},
        channel: {},
        role: {}
    }));
};

module.exports = {
    loadPersist,
    savePersist,
    wipePersist
}