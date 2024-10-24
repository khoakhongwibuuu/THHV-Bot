const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');

const dirname = global.dirname;
const stdlib = global.stdlib;

const loadModule = (moduleName) => {
    (`[${new Date().toISOString()}] [INFO] Client: loading ${moduleName} module!`).logOffline();
    require(path.join(dirname, 'modules', moduleName, 'main.js'));
    (`[${new Date().toISOString()}] [SUCCESS] Client: loaded ${moduleName} module successfully!`).logOffline();
}

module.exports = {
    name: Discord.Events.ClientReady,
    once: true,
    async execute(client) {
        if (process.env.OWNER_ID === "") {
            (`[${new Date().toISOString()}] [ERROR] You have NOT provide the Bot owner ID in auth/login.key. This BOT will be automatically turned off.`).logOffline();
            process.exit(1);
        }

        // Login success event
        (`[${new Date().toISOString()}] [SUCCESS] Ready! Logged in as ${client.user.tag}`).logOffline();

        // Load modules
        fs.readdir(path.join(dirname, "modules"), { withFileTypes: true }, (err, files) => {
            files.forEach(file => {
                if (file.isDirectory()) {
                    fs.access(path.join(dirname, "modules", file.name, "main.js"), fs.constants.F_OK, (err) => {
                        if (!err) { loadModule(file.name); }
                    });
                }
            });
        });

        // Set client presence
        client.user.setPresence({
            activities: [{
                name: 'Bot đang thử nghiệm.',
                type: Discord.ActivityType.Playing
            }],
            status: 'online'
        });
    },
};