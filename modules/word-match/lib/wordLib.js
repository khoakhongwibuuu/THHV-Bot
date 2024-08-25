// Packages
const fs = require('fs');
const path = require('path');

// Universal
const dirname = global.dirname;
const stdlib = global.stdlib;
const discordAPI = global.discordAPI;

// Configuration
const defaultSettingProfile = (channelId) => {
    return {
        channelId: channelId,
        recentUser: null,
        used: {}
    }
}

// Functions
const guildSetup = (guildId, channelId) => {
    const guildDataPath = path.join(dirname, 'modules/word-match/config', `${guildId}.json`);
    if (!fs.existsSync(guildDataPath)) {
        fs.writeFileSync(guildDataPath, JSON.stringify(defaultSettingProfile(channelId)), 'utf8');
    }
}


// Lib validation
const validateLib = () => { return true }

module.exports.guildSetup = guildSetup;
module.exports.validateLib = validateLib;