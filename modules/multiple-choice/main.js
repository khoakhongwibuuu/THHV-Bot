// Packages
const fs = require('fs');
const path = require('path');

const configPath = path.join(global.dirname, 'modules/multiple-choice/config');
if (!fs.existsSync(configPath)) {
    fs.mkdirSync(configPath, { recursive: true });
}

const mcLib = require("./lib/gameLib");
global.client.guilds.cache.filter(guild => mcLib.isSetup(guild.id)).forEach(guild => {
    mcLib.guildUnlock(guild.id);
    mcLib.updateOutdatedFiles(guild.id);
});
