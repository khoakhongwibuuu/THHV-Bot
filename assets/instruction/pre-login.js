const fs = require('node:fs');
const fsPromises = require('node:fs').promises;
const path = require('node:path');
const { dirname } = global.variable;

module.exports.loadModules = async () => {
    const modulesPath = path.join(dirname, "modules");
    const modules = await fsPromises.readdir(modulesPath, { withFileTypes: true });

    for (const offlineModule of modules) {
        if (offlineModule.isDirectory()) {
            const loaderPath = path.join(modulesPath, offlineModule.name, "offline-loader.js");
            if (fs.existsSync(loaderPath)) {
                try {
                    await fsPromises.access(loaderPath);
                    console.log(`[${new Date().toISOString()}] [INFO] Client: loading ${offlineModule.name} module!`);
                    const loadTime = Date.now();
                    require(loaderPath);
                    const finishTime = Date.now();
                    console.log(`[${new Date().toISOString()}] [SUCCESS] Client: loaded ${offlineModule.name} module in ${finishTime - loadTime}ms!`);
                } catch (err) {
                    console.error(`[${new Date().toISOString()}] [ERROR] Error loading module ${offlineModule.name}:`, err);
                    process.exit(1);
                }
            }
        }
    }
}