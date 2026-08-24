// Packages
const fs = require('node:fs');
const path = require('node:path');
const { dirname } = global.variable;

const contestLib = require(path.join(dirname, '/modules/contest/lib/contestLib.js'));
global.customLib.contestLib = contestLib;

const configPath = path.join(dirname, 'configs/contest/config');
if (!fs.existsSync(configPath)) {
    fs.mkdirSync(configPath, { recursive: true });
}

const persistPath = path.join(configPath, 'persist.json');
if (!fs.existsSync(persistPath)) {
    console.log(`[${new Date().toISOString()}] [INFO] module/contest: persist file is not found. Creating new...`);
    fs.writeFileSync(persistPath, JSON.stringify({
        ready: {},
        channel: {},
        role: {}
    }), 'utf-8');
}
