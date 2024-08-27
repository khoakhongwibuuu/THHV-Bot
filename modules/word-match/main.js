(`[${new Date().toISOString()}] [INFO] Client: loading wordMatch module!`).logOffline();

// Packages
const fs = require('fs');
const path = require('path');

// Universal
const stdlib = global.stdlib;
const dirname = global.dirname;
const discordAPI = global.discordAPI;

const configPath = path.join(dirname, 'modules/word-match/config');
if (!fs.existsSync(configPath)) {
    fs.mkdirSync(configPath, { recursive: true });
}

(`[${new Date().toISOString()}] [SUCCESS] Client: loaded wordMatch module successfully!`).logOffline();
