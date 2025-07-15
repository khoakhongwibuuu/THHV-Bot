// Packages
const fs = require('node:fs');
const path = require('node:path');
const { dirname } = global.variable;

const reactLib = require(path.join(dirname, '/modules/auto-reactor/lib/reactLib.js'));
global.customLib.reactLib = reactLib;

const configPath = path.join(dirname, 'modules/auto-reactor/config');
if (!fs.existsSync(configPath)) {
    fs.mkdirSync(configPath, { recursive: true });
}

const guildFiles = fs.readdirSync(configPath).filter(file => file.endsWith('json'));

for (const guildFile of guildFiles) {
    const guildId = guildFile.slice(0, guildFile.lastIndexOf('.')) || guildFile;
    reactLib.preLoad(guildId);
}