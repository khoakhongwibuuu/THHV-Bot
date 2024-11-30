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
        .setName('cf-handle')
        .setDescription('Search user by handle in Codeforces.')
        .setDMPermission(true)
        .addStringOption(option =>
            option.setName("handle")
                .setDescription("Handle of user.")
                .setRequired(true)
        )
    ,
    async execute(interaction) {
        const handle = interaction.options.getString("handle");
        const statusData = await codeforcesLib.fetchData(`https://codeforces.com/api/user.status?handle=${handle}`);
        const infoData = await codeforcesLib.fetchData(`https://codeforces.com/api/user.info?handles=${handle}`);
    },
};
