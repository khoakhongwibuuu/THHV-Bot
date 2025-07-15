// Packages
const fs = require('node:fs');
const path = require('node:path');
const { dirname } = global.variable;

global.customLib = {};
global.customLib.discordAPI = require(path.join(dirname, '/assets/api/discord.api.js'));
global.customLib.memory = require(path.join(dirname, '/assets/api/memory.api.js'));
global.customLib.stdlib = require(path.join(dirname, '/assets/library/standard.js'));

fs.readdir(path.join(dirname, "modules"), { withFileTypes: true }, (err, files) => {
    files.forEach(file => {
        if (file.isDirectory()) {
            fs.access(path.join(dirname, "modules", file.name, "offline-loader.js"), fs.constants.F_OK, (err) => {
                if (!err) {
                    console.log(`[${new Date().toISOString()}] [INFO] Client: loading ${file.name} module!`);
                    const loadTime = Date.now();
                    try {
                        require(path.join(dirname, 'modules', file.name, 'offline-loader.js'));
                    }
                    catch (err) {
                        console.error(`[${new Date().toISOString()}] [ERROR] Error found while loading module ${file.name}:`, err);
                        process.exit(1);
                    }
                    const finishTime = Date.now();
                    console.log(`[${new Date().toISOString()}] [SUCCESS] Client: loaded ${file.name} module successfully in ${finishTime - loadTime}ms!`);
                }
            });
        }
    });
});