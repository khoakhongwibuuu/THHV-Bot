const Discord = require('discord.js');
const dirname = global.dirname;
const stdlib = global.stdlib;

module.exports = {
    name: Discord.Events.ClientReady,
    once: true,
    async execute(client) {
        const coreLib = require(dirname + '/assets/library/core.js');
        if (coreLib.load().owner === "") {
            (`[${new Date().toISOString()}] [ERROR] You have NOT provide the Bot owner ID in configs/core.json. This BOT will be automatically turned off.`).logToFile();
            process.exit(1);
        }
        (`[${BotStartTime}] [SUCCESS] Ready! Logged in as ${client.user.tag}`).logE();

        client.user.setPresence({
            activities: [{
                name: 'orz khoa.khong.wibuuu',
                type: Discord.ActivityType.Playing
            }],
            status: 'online'
        });
        require(dirname + '/assets/api/codeforces.js').exec();
    },
};