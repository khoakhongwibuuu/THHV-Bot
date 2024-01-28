const Discord = require('discord.js');
const dirname = global.dirname;
const stdlib = global.stdlib;

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('')
        .setDescription(''),
    async execute(interaction) {
        const coreLib = require(dirname + '/assets/library/core.js');
        const serverLib = require(dirname + '/assets/library/server.js');
        const core = coreLib.load();
        const server = serverLib.load();
        const guild = global.client.guilds.cache.get(server.guildID);
        
    },
};