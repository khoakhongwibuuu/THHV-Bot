// Packages
const fs = require('fs');
const path = require('path');

// Universal
const dirname = global.dirname;
const stdlib = global.stdlib;
const discordAPI = global.discordAPI;

// Persist Controller
const loadPersist = () => { return JSON.parse(fs.readFileSync(path.join(dirname, 'modules/codeforces-contest/config/persist.json'), 'utf8')); }
const savePersist = (Persist) => { fs.writeFileSync(path.join(dirname, 'modules/codeforces-contest/config/persist.json'), JSON.stringify(Persist)); }

// Lib validation
const validateLib = () => { return true }

module.exports.loadPersist = loadPersist;
module.exports.savePersist = savePersist;
module.exports.validateLib = validateLib;