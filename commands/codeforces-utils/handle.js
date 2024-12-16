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
        await interaction.deferReply({ ephemeral: false });
        const handle = interaction.options.getString("handle");
        const infoData = await codeforcesLib.fetchData(`https://codeforces.com/api/user.info?handles=${handle}`);
        if (!infoData) {
            await interaction.editReply({ content: 'No user with given handle is found.', ephemeral: false });
            return;
        }

        const rank = infoData[0].rank ?? "Unknown";
        const maxRank = infoData[0].maxRank ?? "Unknown";

        const rating = infoData[0].rating ?? 0;
        const maxRating = infoData[0].maxRating ?? 0;

        const sentEmbed = new Discord.EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(handle)
            .setURL(`https://codeforces.com/profile/${handle}`)
            .setThumbnail(infoData[0].avatar)
            .addFields(
                { name: 'Rank', value: rank, inline: true },
                { name: 'Max rank', value: maxRank, inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: 'Rating', value: rating.toString(), inline: true },
                { name: 'Max rating', value: maxRating.toString(), inline: true },
                { name: '\u200B', value: '\u200B' },
            )
            .setTimestamp()

        if (infoData[0].hasOwnProperty("firstName") && infoData[0].hasOwnProperty("lastName"))
            sentEmbed.setDescription(`Info of ${infoData[0].firstName} ${infoData[0].lastName}`)

        await interaction.editReply({ embeds: [sentEmbed], ephemeral: false });
    },
};
