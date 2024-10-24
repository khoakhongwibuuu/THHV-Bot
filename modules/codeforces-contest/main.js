// Packages
const fs = require('fs');
const path = require('path');

// Deliver Module Based Libraries
const cfLib = require('./lib/cf.js');
global.cfLib = cfLib;

const configPath = path.join(global.dirname, 'modules/codeforces-contest/config');
if (!fs.existsSync(configPath)) {
    fs.mkdirSync(configPath, { recursive: true });
}

const persistPath = path.join(global.dirname, 'modules/codeforces-contest/config/persist.json');
if (!fs.existsSync(persistPath)) {
    fs.writeFileSync(persistPath, JSON.stringify({
        ready: {},
        channel: {},
        role: {}
    }));
}

require(path.join(global.dirname, 'modules/codeforces-contest/api/codeforces.api.js')).exec();
