(`[${new Date().toISOString()}] [INFO] Client: loading multipleChoice module!`).logOffline();

// Packages
const fs = require('fs');
const path = require('path');

// Universal
const client = global.client;
const stdlib = global.stdlib;
const dirname = global.dirname;
const discordAPI = global.discordAPI;

const configPath = path.join(dirname, 'modules/multiple-choice/config');
if (!fs.existsSync(configPath)) {
    fs.mkdirSync(configPath, { recursive: true });
}

const mcLib = require("./lib/gameLib");
client.guilds.cache.filter(guild => mcLib.isSetup(guild.id)).forEach(guild => {
    mcLib.guildUnlock(guild.id);
    mcLib.updateOutdatedFiles(guild.id);
});


(`[${new Date().toISOString()}] [SUCCESS] Client: loaded multipleChoice module successfully!`).logOffline();
