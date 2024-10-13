(`[${new Date().toISOString()}] [INFO] Client: loading autoReactor module!`).logOffline();

// Packages
const fs = require('fs');
const path = require('path');

// Universal
const stdlib = global.stdlib;
const dirname = global.dirname;
const discordAPI = global.discordAPI;

const configPath = path.join(dirname, 'modules/auto-reactor/config');
if (!fs.existsSync(configPath)) {
    fs.mkdirSync(configPath, { recursive: true });
}

(`[${new Date().toISOString()}] [SUCCESS] Client: loaded autoReactor module successfully!`).logOffline();
