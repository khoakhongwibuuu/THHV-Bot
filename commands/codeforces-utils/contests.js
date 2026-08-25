// Packages
const Discord = require('discord.js');
const codeforcesLib = require('#modules/codeforces-utils/lib/codeforcesLib.js');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('cf-contests')
        .setDescription('View the list of scheduled contests in Codeforces.')
        .setDMPermission(true)
    ,
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: false });
        const contestData = await codeforcesLib.fetchData(`https://codeforces.com/api/contest.list`);
        const futureList = contestData.filter(contest => contest.phase === 'BEFORE');

        if (futureList.length === 0) {
            await interaction.editReply("There is no scheduled contests at the moment.");
            return;
        }

        const sentEmbed = new Discord.EmbedBuilder()
            .setTitle(`**Found ${futureList.length} scheduled contest${futureList.length > 1 ? "s" : ""}.**`)
            .setColor(0x0099FF)
            .setTimestamp()

        futureList.reverse();
        futureList.forEach(contest => {
            let contestDetail = `Link: [${contest.name}](https://codeforces.com/contests/${contest.id})\n`
                + `Start time: <t:${contest.startTimeSeconds}:F> (<t:${contest.startTimeSeconds}:R>)`
                ;

            sentEmbed.addFields(
                { name: `**👩🏻‍💻 ${contest.name}**`, value: contestDetail }
            )
        });

        await interaction.followUp({ embeds: [sentEmbed] });

    },
};
