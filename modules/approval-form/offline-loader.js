// Packages
const fs = require('node:fs');
const path = require('node:path');
const { dirname } = global.variable;

const formLib = require(path.join(dirname, '/modules/approval-form/lib/formLib.js'));
global.customLib.formLib = formLib;

const configPath = path.join(dirname, 'modules/approval-form/config');
if (!fs.existsSync(configPath)) {
    fs.mkdirSync(configPath, { recursive: true });
}

const guildFiles = fs.readdirSync(configPath).filter(file => file.endsWith('json'));

for (const guildFile of guildFiles) {
    const guildId = guildFile.slice(0, guildFile.lastIndexOf('.')) || guildFile;
    formLib.preLoad(guildId);
}