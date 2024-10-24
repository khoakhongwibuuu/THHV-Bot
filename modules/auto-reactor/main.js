// Packages
const fs = require('fs');
const path = require('path');

const configPath = path.join(global.dirname, 'modules/auto-reactor/config');
if (!fs.existsSync(configPath)) {
    fs.mkdirSync(configPath, { recursive: true });
}
