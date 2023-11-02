const fs = require('fs');
const Discord = require('discord.js');
// Basic
const client = global.client;
const Config = global.Config;
const Lang = global.Lang;
const Utils = global.Utils;
const Base_Lang = global.Base_Lang;
const dirname = global.dirname;

const execute = (msg, para) => {
    if (para.length < 2) {
        const GameLib = require(dirname + '/game/lib/standardLib.js');
        const userID = (para.length === 0) ? msg.author.id : Utils.analyticsResultectToID(para[0]);
        let loadedData = GameLib.readScore(userID);
        if (loadedData !== "Unknown") {
            const chartConfigString = encodeURIComponent(JSON.stringify({
                type: 'line',
                data: {
                    labels: loadedData.map((value, index) => index),
                    datasets: [{
                        label: `Score of ${client.users.get(userID).username}`,
                        data: loadedData,
                        fill: false,
                        borderColor: 'rgb(255, 105, 105)',
                        tension: 0.1
                    }]
                }
            }));
            const width = 1440;
            const height = 720;
            // const analyticsResult = analytics(loadedData);
            let analyticsResult = {};
            analyticsResult["current"] = loadedData[loadedData.length - 1];
            analyticsResult["attempt"] = loadedData.length - 1;
            let maxLength = 1;
            let length = 1;
            let correct = 0;

            for (let i = 1; i < loadedData.length; i++) {
                if (loadedData[i] > loadedData[i - 1]) {
                    length++;
                    correct++;
                } else {
                    maxLength = Math.max(length, maxLength);
                    length = 1;
                }
            }

            let streak = Math.max(length, maxLength);

            analyticsResult["streak"] = streak - 1;
            analyticsResult["correct"] = correct;
            analyticsResult["max"] = Math.max(...loadedData);

            // Distribution
            let sortedArr = loadedData.sort((a, b) => a - b);
            let median = 0;
            if (sortedArr.length % 2 === 0)
                median = (sortedArr[sortedArr.length / 2 - 1] + sortedArr[sortedArr.length / 2]) / 2;
            else
                median = sortedArr[(sortedArr.length - 1) / 2];

            let sum = loadedData.reduce((a, b) => a + b, 0);
            let mean = sum / loadedData.length;
            if (!Number.isInteger(mean))
                mean = mean.toFixed(1);


            analyticsResult["mean"] = mean;
            analyticsResult["median"] = median;

            msg.channel.send({
                embeds: [new Discord.MessageEmbed()
                    .setTitle(`Score of ${client.users.get(userID).username}`)
                    .setColor(parseInt(Base_Lang.status.info, 16))
                    .setDescription(`The following data belongs to <@${userID}>\n\n`
                        + `Current score: \`${analyticsResult.current}\`\n`
                        + `Attempts: \`${analyticsResult.attempt}\`\n`
                        + `Highest Score: \`${analyticsResult.max}\`\n`
                        + `Longest Streak: \`${analyticsResult.streak}\`\n`
                        + `Correct Answers: \`${analyticsResult.correct}\`\n\n`
                        + `Mean: \`${analyticsResult.mean}\`\n`
                        + `Median: \`${analyticsResult.median}\`\n`)
                    .setImage(`attachment://${userID}.png`)],
                files: [{
                    attachment: `https://quickchart.io/chart?w=${width}&h=${height}&c=${chartConfigString}`,
                    name: `${userID}.png`
                }]
            });
        } else {
            msg.channel.send({
                embed: {
                    color: parseInt(Base_Lang.status.warning, 16),
                    description: (Utils.isNum(userID)) ? `${(userID === msg.author.id) ? "Your " : `<@${userID}>`} data is not found in the database.` : "Please use User ID or Mentions instead."
                }
            });
        }
    } else {
        msg.channel.send({
            embed: {
                color: parseInt(Base_Lang.status.warning, 16),
                description: `:warning: ${Lang.error.parameter}`
            }
        });
    }
}

module.exports.execute = execute;
