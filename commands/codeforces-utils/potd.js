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
        .addStringOption(option =>
            option.setName("tags")
                .setDescription("Tags to be filtered, split by semicolons. E.g. dp;two pointers;greedy")
                .setRequired(false)
        )
    ,
    async execute(interaction) {
        let minRating = interaction.options.getInteger("rating-from");
        let maxRating = interaction.options.getInteger("rating-to");
        const tags = interaction.options.getString("tags") ?? "";

        // Input validation
        if (minRating > maxRating)
            [minRating, maxRating] = [maxRating, minRating];
        minRating = Math.max(0, minRating);
        maxRating = Math.min(3500, maxRating);

        const problemSet = await codeforcesLib.getData(`https://codeforces.com/api/problemset.problems?tags=${tags}`);
        const filteredProblemList = problemSet.problems.filter(prob => prob.rating >= minRating && prob.rating <= maxRating);

        console.log(filteredProblemList);
        if (filteredProblemList.length === 0) {
            interaction.reply({
                content: "No contests matching criteria found.",
                ephemeral: true
            });
        } else {
            const chosenProblem = filteredProblemList.randomValue();
            // interaction.reply({
            //     content: `[${chosenProblem.name}](https://codeforces.com/problemset/problem/${chosenProblem.contestId}/${chosenProblem.index})`,
            //     ephemeral: false
            // });
        }
    },
};
