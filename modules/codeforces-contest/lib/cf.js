// Packages
const fs = require('fs');
const path = require('path');

// Persist Controller
const persistPath = path.join(global.dirname, 'modules/codeforces-contest/config/persist.json');
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