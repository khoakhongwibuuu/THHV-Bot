// Packages
const fs = require('node:fs');
const path = require('node:path');
const { dirname } = global.variable;

const wordLib = require(path.join(dirname, '/modules/word-match/lib/wordLib.js'));
global.customLib.wordLib = wordLib;

const configPath = path.join(dirname, 'configs/word-match/config');
if (!fs.existsSync(configPath)) {
    fs.mkdirSync(configPath, { recursive: true });
}

const guildFiles = fs.readdirSync(configPath).filter(file => file.endsWith('json'));

for (const guildFile of guildFiles) {
    const guildId = guildFile.slice(0, guildFile.lastIndexOf('.')) || guildFile;
    wordLib.preLoad(guildId);
}