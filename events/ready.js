const { Events, ActivityType } = require('discord.js');

const dirname = global.dirname;

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        const serverLib = require(dirname + '/assets/library/server.js');
        const coreLib = require(dirname + '/assets/library/core.js');
        if (serverLib.load().guildID === "") {
            console.log('[ERROR] You have NOT provide a guild ID in configs/server.json, this BOT will be automatically turned off.');
            process.exit(1);
        }
        if (coreLib.load().owner === "") {
            console.log('[ERROR] You have NOT provide the Bot owner ID in configs/core.json, this BOT will be automatically turned off.');
            process.exit(1);
        }
        
        (`[${BotStartTime}] [SUCCESS] Ready! Logged in as ${client.user.tag}`).logE();

        client.user.setPresence({
            activities: [{
                name: 'codeforces contest.',
                type: ActivityType.Watching
            }],
            status: 'online'
        });
        require(dirname + '/assets/api/codeforces.js').exec();
    },
};