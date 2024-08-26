(`[${new Date().toISOString()}] [INFO] Client: loading codeforces-contest module!`).logOffline();

// Packages
const fs = require('fs');
const path = require('path');

// Universal
const stdlib = global.stdlib;
const dirname = global.dirname;
const discordAPI = global.discordAPI;

// Deliver Module Based Libraries
const cfLib = require('./lib/cf.js');
global.cfLib = cfLib;

const persistPath = path.join(dirname, '/modules/codeforces-contest/config/persist.json');
if (!fs.existsSync(persistPath)) {
    fs.writeFileSync(persistPath, JSON.stringify({
        ready: {},
        channel: {},
        role: {}
    }));
}


(`[${new Date().toISOString()}] [SUCCESS] Client: loaded codeforces-contest module!`).logOffline();
require(path.join(dirname, '/modules/codeforces-contest/api/codeforces.api.js')).exec();
