// Packages
const fs = require('node:fs');
const path = require('node:path');
const { dirname } = global.variable;

const contestLib = require(path.join(dirname, '/modules/contest/lib/contestLib.js'));
global.customLib.contestLib = contestLib;

const configPath = path.join(dirname, 'modules/contest/config');
if (!fs.existsSync(configPath)) {
    fs.mkdirSync(configPath, { recursive: true });
}

const persistPath = path.join(dirname, 'modules/contest/config/persist.json');
if (!fs.existsSync(persistPath)) {
    fs.writeFileSync(persistPath, JSON.stringify({
        ready: {},
        channel: {},
        role: {}
    }), 'utf-8');
}
