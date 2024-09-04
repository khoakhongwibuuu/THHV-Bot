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

        // Login success event
        (`[${new Date().toISOString()}] [SUCCESS] Ready! Logged in as ${client.user.tag}`).logOffline();

        // Load modules
        require(path.join(dirname, '/modules/codeforces-contest/main.js'));
        require(path.join(dirname, '/modules/word-match/main.js'));
        require(path.join(dirname, '/modules/multiple-choice/main.js'));

        client.user.setPresence({
            activities: [{
                name: 'Bot đang thử nghiệm.',
                type: Discord.ActivityType.Playing
            }],
            status: 'online'
        });
    },
};