// Packages
const fs = require('node:fs');
const path = require('node:path');
const { dirname } = global.variable;

const gameLib = require(path.join(dirname, '/modules/trivia-game/lib/gameLib.js'));
global.customLib.gameLib = gameLib;

const configPath = path.join(dirname, 'modules/trivia-game/config');
if (!fs.existsSync(configPath)) {
    fs.mkdirSync(configPath, { recursive: true });
}

const guildFiles = fs.readdirSync(configPath).filter(file => file.endsWith('json'));

for (const guildFile of guildFiles) {
    const guildId = guildFile.slice(0, guildFile.lastIndexOf('.')) || guildFile;
    gameLib.preLoad(guildId);
}