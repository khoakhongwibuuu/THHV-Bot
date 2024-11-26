const path = require('path');
const Discord = require('discord.js');

// Universal
const dirname = global.dirname;
const stdlib = global.stdlib;
const discordAPI = global.discordAPI;

// Module Specified
const codeforcesLib = require(path.join(dirname, 'modules/codeforces-utils/lib/codeforcesLib.js'));

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('cf-potd')
        .setDescription('Recommend a Problem of The Day.')
        .setDMPermission(true)
        .addIntegerOption(option =>
            option.setName("rating-from")
                .setDescription("Minimum rating of the problem. Should not below 0.")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName("rating-to")
                .setDescription("Maximum rating of the problem. Should not exceed 3500.")
                .setRequired(true)
        )
    ,
    async execute(interaction) {

    },
};
