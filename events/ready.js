const Discord = require('discord.js');
const path = require('path');

const dirname = global.dirname;
const stdlib = global.stdlib;

module.exports = {
    name: Discord.Events.ClientReady,
    once: true,
    async execute(client) {
        if (process.env.OWNER_ID === "") {
            (`[${new Date().toISOString()}] [ERROR] You have NOT provide the Bot owner ID in auth/login.key. This BOT will be automatically turned off.`).logOffline();
            process.exit(1);
        }

        (`[${new Date().toISOString()}] [SUCCESS] Ready! Logged in as ${client.user.tag}`).logOffline();
        // Load modules
        require(path.join(dirname, '/modules/codeforces-contest/main.js'));
        client.user.setPresence({
            activities: [{
                name: '',
                type: Discord.ActivityType.Playing
            }],
            status: 'online'
        });
    },
};