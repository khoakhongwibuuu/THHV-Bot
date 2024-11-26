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
        .setName('cf-contests')
        .setDescription('View the list of scheduled contests in Codeforces.')
        .setDMPermission(true)
    ,
    async execute(interaction) {
        const contestData = await codeforcesLib.getData(`https://codeforces.com/api/contest.list`);
        const futureList = contestData.filter(contest => contest.phase === 'BEFORE');
    },
};
