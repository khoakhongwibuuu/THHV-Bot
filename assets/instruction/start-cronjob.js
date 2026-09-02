const fs = require('node:fs');
const fsPromises = require('node:fs').promises;
const path = require('node:path');

module.exports.start = async () => {
    const modulesPath = path.join(__dirname, '../../modules');
    const modules = await fsPromises.readdir(modulesPath, { withFileTypes: true });

    for (const moduleDir of modules) {
        if (moduleDir.isDirectory()) {
            const loaderPath = path.join(modulesPath, moduleDir.name, "cron-job.js");
            if (fs.existsSync(loaderPath)) {
                try {
                    await fsPromises.access(loaderPath);
                    require(loaderPath);
                    console.log(`[INFO] Client: started cron-job of ${moduleDir.name} module.`);
                } catch (err) {
                    console.error(`[ERROR] Error occurred while starting cron-job of module ${moduleDir.name}:`, err);
                    process.exit(1);
                }
            }
        }
    }
}