// Packages
const fs = require('fs');
const path = require('path');

const configPath = path.join(global.dirname, 'modules/word-match/config');
if (!fs.existsSync(configPath)) {
    fs.mkdirSync(configPath, { recursive: true });
}

const wordLib = require("./lib/wordLib");
const guildFiles = fs.readdirSync(configPath).filter(file => file.endsWith('json'));

for (const guildFile of guildFiles) {
    const guildId = guildFile.slice(0, guildFile.lastIndexOf('.')) || guildFile;
    wordLib.preLoad(guildId);
    // mcLib.guildUnlock(guildId);
    // mcLib.updateOutdatedFiles(guildId);
}
