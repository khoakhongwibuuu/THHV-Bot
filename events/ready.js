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
        if (process.env.ONLINE_STATUS) {
            await client.user.setPresence({
                activities: [{
                    name: process.env.ONLINE_STATUS,
                    type: Discord.ActivityType.Playing
                }],
                status: 'online'
            });
        }
    },
};