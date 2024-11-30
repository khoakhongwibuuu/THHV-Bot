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
        await interaction.deferReply({ ephemeral: true });
        await interaction.editReply({ content: 'This command is under development!', ephemeral: true });
        return;
        const contestData = await codeforcesLib.fetchData(`https://codeforces.com/api/contest.list`);
        const futureList = contestData.filter(contest => contest.phase === 'BEFORE');

        interaction.reply(
            (futureList.length === 0)
                ? "There is no scheduled contests."
                : `Found ${futureList} scheduled contest${futureList.length > 1 ? "s" : ""}.`
        );

        list.forEach(contest => {
            const startTime = new Date(parseInt(contest.startTimeSeconds) * 1000);

        });

    },
};
