const fs = require('fs');
const Discord = require('discord.js');
// Basic
const client = global.client;
const Config = global.Config;
const Lang = global.Lang;
const Utils = global.Utils;
const Base_Lang = global.Base_Lang;
const dirname = global.dirname;

const GameLib = require(dirname + '/game/lib/standardLib.js');

const analytics = (arr) => {
    let obj = {};
    obj["current"] = arr[arr.length - 1];

    let maxLength = 1;
    let length = 1;
    let correct = 0;

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > arr[i - 1]) {
            length++;
            correct++;
        } else {
            maxLength = Math.max(length, maxLength);
            length = 1;
        }
    }

    let streak = Math.max(length, maxLength);
    if (arr[0] > 0) {
        correct++;
    }

    obj["streak"] = streak - 1;
    obj["correct"] = correct;
    obj["max"] = Math.max(...arr);

    // Distribution
    let sortedArr = arr.sort((a, b) => a - b);
    let median = 0;
    if (sortedArr.length % 2 === 0)
        median = (sortedArr[sortedArr.length / 2 - 1] + sortedArr[sortedArr.length / 2]) / 2;
    else
        median = sortedArr[(sortedArr.length - 1) / 2];

    let sum = arr.reduce((a, b) => a + b, 0);
    let mean = sum / arr.length;
    if (!Number.isInteger(mean))
        mean = mean.toFixed(2);


    obj["mean"] = mean;
    obj["median"] = median;

    return obj;
}

const execute = (msg, para) => {
    if (para.length < 2) {
        // console.log(para)
        const userID = (para.length === 0) ? msg.author.id : Utils.objectToID(para[0].toString());
        const playerDatapath = dirname + '/configs/playerdata.json';
        const playerdata = JSON.parse(fs.readFileSync(playerDatapath, 'utf8'));
        if (playerdata.hasOwnProperty(userID) && playerdata[userID].length > 0) {
            const chartConfigString = encodeURIComponent(JSON.stringify({
                type: 'line',
                data: {
                    labels: playerdata[userID].map((value, index) => `${index + 1}`),
                    datasets: [{
                        label: `Score of ${client.users.get(userID).username}`,
                        data: playerdata[userID],
                        fill: false,
                        borderColor: 'rgb(255, 105, 105)',
                        tension: 0.1
                    }]
                }
            }));
            const width = 1440;
            const height = 720;
            const analyticsResult = analytics(playerdata[userID]);
            msg.channel.send({
                embeds: [new Discord.MessageEmbed()
                    .setTitle(`Score of ${client.users.get(userID).username}`)
                    .setColor(parseInt(Base_Lang.status.info, 16))
                    .setDescription(`Current: \`${analyticsResult.current}\`\n`
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
                    description: `${(userID === msg.author.id) ? "Your " : `<@${userID}>`} data is not found in the database.`
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
