// Special library
const fs = require('fs');

// Basic variables
const dirname = global.dirname;

// Creating config directory
if (!fs.existsSync(dirname + '/configs')) {
    fs.mkdirSync(dirname + '/configs', { recursive: true });
}

// Creating log directory
if (!fs.existsSync(dirname + '/logs')) {
    fs.mkdirSync(dirname + '/logs', { recursive: true });
}

const coreLib = require('./core.js');
const gameLib = require('./game.js');
const serverLib = require('./server.js');

const authPath = dirname + '/configs/auth.json';
if (!fs.existsSync(authPath)) {
    fs.writeFileSync(authPath, JSON.stringify({
        ClientID: "",
        PublicKey: "",
        token: ""
    }, null, 4));
}

const persistPath = dirname + '/configs/persist.json';
if (!fs.existsSync(persistPath)) {
    fs.writeFileSync(persistPath, JSON.stringify({
        ready: {},
        channel: {}
    }));
}

gameLib.unlock();