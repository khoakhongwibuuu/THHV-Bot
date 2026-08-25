const fs = require('node:fs');
const fsPromises = require('node:fs').promises;
const path = require('node:path');

module.exports.loadModules = async () => {
    const modulesPath = path.join(__dirname, '../../modules');
    const modules = await fsPromises.readdir(modulesPath, { withFileTypes: true });

    for (const onlineModule of modules) {
        if (onlineModule.isDirectory()) {
            const loaderPath = path.join(modulesPath, onlineModule.name, "online-loader.js");
            if (fs.existsSync(loaderPath)) {
                try {
                    await fsPromises.access(loaderPath);
                    console.log(`[${new Date().toISOString()}] [INFO] Client: loading ${onlineModule.name} module!`);
                    const loadTime = Date.now();
                    require(loaderPath);
                    const finishTime = Date.now();
                    console.log(`[${new Date().toISOString()}] [SUCCESS] Client: loaded ${onlineModule.name} module in ${finishTime - loadTime}ms!`);
                } catch (err) {
                    console.error(`[${new Date().toISOString()}] [ERROR] Error loading module ${onlineModule.name}:`, err);
                    process.exit(1);
                }
            }
        }
    }
}