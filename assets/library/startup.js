// Special library
const fs = require('node:fs');

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

