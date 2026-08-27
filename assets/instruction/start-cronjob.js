const fs = require('node:fs');
const fsPromises = require('node:fs').promises;
const path = require('node:path');

module.exports.start = async () => {
    const modulesPath = path.join(__dirname, '../../modules');
    const modules = await fsPromises.readdir(modulesPath, { withFileTypes: true });

    for (const onlineModule of modules) {
        if (onlineModule.isDirectory()) {
            const loaderPath = path.join(modulesPath, onlineModule.name, "cron-job.js");
            if (fs.existsSync(loaderPath)) {
                try {
                    await fsPromises.access(loaderPath);
                    require(loaderPath);
                    console.log(`[INFO] Client: started cron-job of ${onlineModule.name} module.`);
                } catch (err) {
                    console.error(`[ERROR] Error occurred while starting cron-job of module ${onlineModule.name}:`, err);
                    process.exit(1);
                }
            }
        }
    }
}