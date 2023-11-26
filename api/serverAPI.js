const fs = require('fs');
const Utils = global.Utils;
const dirname = global.dirname;

const serverPath = dirname + '/configs/server.json';

if (!fs.existsSync(serverPath)) {
    fs.writeFileSync(serverPath, JSON.stringify({}));
}

const loadRawData = () => {
    return JSON.parse(fs.readFileSync(serverPath, 'utf8'));
}

module.exports.loadRawData = loadRawData;
