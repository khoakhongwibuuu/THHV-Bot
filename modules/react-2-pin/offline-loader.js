// Packages
const fs = require('node:fs');
const path = require('node:path');
const { dirname } = global.variable;

const autoPinLib = require(path.join(dirname, '/modules/react-2-pin/lib/autoPinLib.js'));
global.customLib.autoPinLib = autoPinLib;

const configPath = path.join(dirname, 'modules/react-2-pin/config');
if (!fs.existsSync(configPath)) {
    fs.mkdirSync(configPath, { recursive: true });
}

const guildFiles = fs.readdirSync(configPath).filter(file => file.endsWith('json'));

for (const guildFile of guildFiles) {
    const guildId = guildFile.slice(0, guildFile.lastIndexOf('.')) || guildFile;
    autoPinLib.preLoad(guildId);
}