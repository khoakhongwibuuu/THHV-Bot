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
    },
};