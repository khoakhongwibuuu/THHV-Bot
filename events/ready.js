const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');

const loadModule = (moduleName) => {
    console.log(`[${new Date().toISOString()}] [INFO] Client: loading ${moduleName} module!`);
    try {
        require(path.join(global.dirname, 'modules', moduleName, 'main.js'));
    }
    catch (err) {
        console.error(`[${new Date().toISOString()}] [ERROR] Error found while loading module ${moduleName}:`, err);
        process.exit(1);
    }
    console.log(`[${new Date().toISOString()}] [SUCCESS] Client: loaded ${moduleName} module successfully!`);
}

module.exports = {
    name: Discord.Events.ClientReady,
    once: true,
    async execute(client) {
        if (process.env.OWNER_ID === "") {
            console.log(`[${new Date().toISOString()}] [ERROR] You have NOT provide the Bot owner ID in auth/login.key. This BOT will be automatically turned off.`);
            process.exit(1);
        }

        // Login success event
        console.log(`[${new Date().toISOString()}] [SUCCESS] Ready! Logged in as ${client.user.tag}`);

        // Load modules
        fs.readdir(path.join(global.dirname, "modules"), { withFileTypes: true }, (err, files) => {
            files.forEach(file => {
                if (file.isDirectory()) {
                    fs.access(path.join(global.dirname, "modules", file.name, "main.js"), fs.constants.F_OK, (err) => {
                        if (!err) { loadModule(file.name); }
                    });
                }
            });
        });

        // Set client presence
        client.user.setPresence({
            activities: [{
                name: 'credit khoa06, david0403.',
                type: Discord.ActivityType.Playing
            }],
            status: 'online'
        });
    },
};