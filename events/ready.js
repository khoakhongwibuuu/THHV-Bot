// Packages
const Discord = require('discord.js');
const path = require('node:path');
const { dirname } = require('#assets/library/state.js');

module.exports = {
    name: Discord.Events.ClientReady,
    once: true,
    async execute(client) {
        // Login success event
        console.log(`[${new Date().toISOString()}] [SUCCESS] Client: Ready! Logged in as ${client.user.tag}`);

        // Load online modules
        await require('#assets/instruction/post-login.js').loadModules();

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