// Packages
const fs = require('fs');
const path = require('path');

const configPath = path.join(global.dirname, 'modules/multiple-choice/config');
if (!fs.existsSync(configPath)) {
    fs.mkdirSync(configPath, { recursive: true });
}

const mcLib = require("./lib/gameLib");
const guildFiles = fs.readdirSync(configPath).filter(file => file.endsWith('json'));

for (const guildFile of guildFiles) {
    const guildId = guildFile.slice(0, guildFile.lastIndexOf('.')) || guildFile;
    mcLib.guildUnlock(guildId);
    mcLib.updateOutdatedFiles(guildId);
}
