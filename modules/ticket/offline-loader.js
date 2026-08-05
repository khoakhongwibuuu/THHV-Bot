// Packages
const fs = require('node:fs');
const path = require('node:path');
const { dirname } = global.variable;

const ticketLib = require(path.join(dirname, '/modules/ticket/lib/ticketLib.js'));
global.customLib.ticketLib = ticketLib;

const configPath = path.join(dirname, 'configs/ticket/config');
if (!fs.existsSync(configPath)) {
    fs.mkdirSync(configPath, { recursive: true });
}

const guildFiles = fs.readdirSync(configPath).filter(file => file.endsWith('json'));

for (const guildFile of guildFiles) {
    const guildId = guildFile.slice(0, guildFile.lastIndexOf('.')) || guildFile;
    ticketLib.preLoad(guildId);
}