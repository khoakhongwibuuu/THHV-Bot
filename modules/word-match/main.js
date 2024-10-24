// Packages
const fs = require('fs');
const path = require('path');

const configPath = path.join(global.dirname, 'modules/word-match/config');
if (!fs.existsSync(configPath)) {
    fs.mkdirSync(configPath, { recursive: true });
}
