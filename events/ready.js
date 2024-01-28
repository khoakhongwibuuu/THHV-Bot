const Discord = require('discord.js');
const dirname = global.dirname;
const stdlib = global.stdlib;

module.exports = {
    name: Discord.Events.ClientReady,
    once: true,
    async execute(client) {
        const serverLib = require(dirname + '/assets/library/server.js');
        const coreLib = require(dirname + '/assets/library/core.js');
        if (serverLib.load().guildID === "") {
            (`[${new Date().toISOString()}] [ERROR] You have NOT provide a guild ID in configs/server.json. For security reasons, this BOT will be automatically turned off.`).logToFile();
            process.exit(1);
        }
        if (coreLib.load().owner === "") {
            (`[${new Date().toISOString()}] [ERROR] You have NOT provide the Bot owner ID in configs/core.json. For security reasons, this BOT will be automatically turned off.`).logToFile();
            process.exit(1);
        }
        if (serverLib.load().panel === "") {
            (`[${new Date().toISOString()}] [WARNING] You have NOT provide the ID of the control-panel API in configs/server.json. For security reasons, access to all high-risk commands will be blocked.`).logToFile();
        }
        (`[${BotStartTime}] [SUCCESS] Ready! Logged in as ${client.user.tag}`).logE();

        client.user.setPresence({
            activities: [{
                name: '@THHV-Bot to get started.',
                type: Discord.ActivityType.Playing
            }],
            status: 'online'
        });

        // INT INPUT

        const guild = global.client.guilds.cache.get(serverLib.load().guildID);

        require(dirname + '/assets/api/codeforces.js').exec();
    },
};