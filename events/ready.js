// Packages
const Discord = require('discord.js');
const path = require('node:path');
const { dirname } = global.variable;

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

        // Load custom post-login-instruction
        require(path.join(dirname, 'assets/instruction/post-login.js'));

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