const Discord = require('discord.js');
const dirname = global.dirname;
const stdlib = global.stdlib;

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('graph')
        .setDescription('View your score history or anyone else as a graph.')
        .addUserOption(option =>
            option.setName('member')
                .setDescription('Member whose score history you want to view.')
                .setRequired(false)),
    async execute(interaction) {
        const gameLib = require(dirname + '/assets/library/game.js');
        const serverLib = require(dirname + '/assets/library/server.js');
        if (interaction.guildId === serverLib.load().guildID) {
            const server = global.client.guilds.cache.get(serverLib.load().guildID);
            const target = interaction.options.getUser('member') ?? interaction.user;
            const userID = target.id;
            const loadedData = gameLib.readScore(userID);
            if (loadedData !== "Unknown") {
                const chartConfigString = encodeURIComponent(JSON.stringify({
                    type: 'line',
                    data: {
                        labels: loadedData.map((value, index) => index),
                        datasets: [{
                            label: `Score of ${target.username}`,
                            data: loadedData.filter(e => typeof e === 'number'),
                            fill: false,
                            borderColor: 'rgb(255, 105, 105)',
                            tension: 0.1
                        }]
                    }
                }));

                // Image size
                const width = 1440;
                const height = 720;

                let analyticsResult = {}, maxLength = 1, length = 1, correct = 0, datasize = loadedData.length;
                for (let i = 1; i < datasize; i++) {
                    if (loadedData[i] > loadedData[i - 1]) {
                        length++;
                        correct++;
                    }
                    else {
                        maxLength = Math.max(length, maxLength);
                        length = 1;
                    }
                }
                let accuracy = ((correct / (datasize - 1)) * 100);
                if (accuracy !== Math.floor(accuracy)) accuracy = accuracy.toFixed(2);
                analyticsResult = {
                    "current": loadedData[datasize - 1],
                    "attempt": datasize - 1,
                    "accuracy": accuracy,
                    "streak": Math.max(length, maxLength) - 1,
                    "correct": correct,
                    "max": Math.max(...loadedData)
                };

                interaction.reply({
                    embeds: [new Discord.EmbedBuilder()
                        .setTitle(`Score of ${target.username}`)
                        .setDescription(`The following data belongs to <@${userID}>\n\n`
                            + `Current score: \`${analyticsResult.current}\`\n`
                            + `Attempts: \`${analyticsResult.attempt}\`\n`
                            + `Highest Score: \`${analyticsResult.max}\`\n`
                            + `Longest Streak: \`${analyticsResult.streak}\`\n`
                            + `Correct Answers: \`${analyticsResult.correct}\`\n`
                            + `Accuracy: \`${analyticsResult["accuracy"]}%\``)
                        .setImage(`attachment://${userID}.png`)],
                    files: [{
                        attachment: `https://quickchart.io/chart?w=${width}&h=${height}&c=${chartConfigString}`,
                        name: `${userID}.png`
                    }]
                });
            } else {
                interaction.reply({
                    content: `${(userID === interaction.user.id) ? 'Your ' : `<@${userID}>'s `}data is not found in the database.`,
                    ephemeral: true
                });
            }

        } else {
            interaction.reply({
                content: "This command cannot be used outside THHV.",
                ephemeral: true
            });
        }
    },
};