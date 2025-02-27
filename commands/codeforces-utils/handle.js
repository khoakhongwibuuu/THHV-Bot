const path = require('path');
const Discord = require('discord.js');

// Module Specified
const codeforcesLib = require(path.join(global.dirname, 'modules/codeforces-utils/lib/codeforcesLib.js'));

const solvedCount = (data) => {
    const solvedProblems = new Set();

    data.forEach(submission => {
        if (submission.verdict === 'OK') {
            const problem = submission.problem;
            const problemKey = `${problem.contestId}-${problem.index}`;
            solvedProblems.add(problemKey);
        }
    });

    return solvedProblems.size;
}

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
        await interaction.deferReply({ ephemeral: false });
        const handle = interaction.options.getString("handle");
        if (handle.includes(";")) {
            await interaction.editReply({ content: 'This command does not support multiple handles.', ephemeral: false });
            return;
        }

        const infoData = await codeforcesLib.fetchData(`https://codeforces.com/api/user.info?handles=${handle}`);
        if (!infoData) {
            await interaction.editReply({ content: 'No user with given handle is found.', ephemeral: false });
            return;
        }

        const submissionData = await codeforcesLib.fetchData(`https://codeforces.com/api/user.status?handle=${infoData[0].handle}`);
        const solved = solvedCount(submissionData);

        const rank = infoData[0].rank ?? "Unknown";
        const maxRank = infoData[0].maxRank ?? "Unknown";

        const rating = infoData[0].rating ?? 0;
        const maxRating = infoData[0].maxRating ?? 0;

        const sentEmbed = new Discord.EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(infoData[0].handle)
            .setURL(`https://codeforces.com/profile/${infoData[0].handle}`)
            .setThumbnail(infoData[0].avatar)
            .setDescription(`📅 Date joined codeforces: <t:${infoData[0].registrationTimeSeconds}:F>`
                + `\n⏰ Last online time:       <t:${infoData[0].lastOnlineTimeSeconds}:F>`
            )
            .addFields(
                { name: 'Rank', value: `\`\`\`${rank}\`\`\`` },
                { name: 'Max Rank', value: `\`\`\`${maxRank}\`\`\`` },
                { name: 'Problems solved', value: `\`\`\`${solved}\`\`\``, inline: true },
                { name: 'Rating/Max rating', value: `\`\`\`${rating}/${maxRating}\`\`\``, inline: true },
            )
            .setTimestamp()

        await interaction.editReply({ embeds: [sentEmbed], ephemeral: false });
    },
};
