// Packages
const Discord = require('discord.js');
const path = require('node:path');
const { dirname } = require('#assets/library/state.js');

module.exports = {
    name: Discord.Events.ClientReady,
    once: true,
    async execute(client) {
        // Login success event
        console.log(`[${new Date().toISOString()}] [INFO] Client: Ready! Logged in as ${client.user.tag}`);

        // Start cronjobs
        await require('#assets/instruction/start-cronjob.js').start();

        // Set client presence
        await client.user.setPresence({
            activities: [{
                name: 'credit khoa06, david0403.',
                type: Discord.ActivityType.Playing
            }],
            status: 'online'
        });
    },
};