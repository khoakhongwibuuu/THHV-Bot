const fs = require('fs');
const Discord = require('discord.js');
// Basic
const client = global.client;
const Config = global.Config;
const Lang = global.Lang;
const Utils = global.Utils;
const Base_Lang = global.Base_Lang;
const dirname = global.dirname;

// load additional library
const { createCanvas } = require('canvas');
const Chartjs = require('chart.js/auto');
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
    } else {
        streak--;
    }

    obj["streak"] = streak;
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

const buildLabels = (data) => {
    ret = []
    data.forEach((e, i) => {
        ret.push(i + 1)
    });
    return ret
}

const execute = (msg, para) => {
    if (para.length === 0) {
        // load player data
        const playerDatapath = dirname + '/configs/playerdata.json';
        const playerdata = JSON.parse(fs.readFileSync(playerDatapath, 'utf8'));
        if (playerdata.hasOwnProperty(msg.author.id) && playerdata[msg.author.id].length > 0) {
            // Create canvas
            const canvas = createCanvas(1440, 720);
            const ctx = canvas.getContext('2d');
            // Create the line chart
            new Chartjs(ctx, {
                type: 'line',
                data: {
                    labels: buildLabels(playerdata[msg.author.id]),
                    datasets: [{
                        label: `Score of ${client.users.get(msg.author.id).username}`,
                        data: playerdata[msg.author.id]
                    }]
                },
                options: {
                    plugins: {
                        customCanvasBackgroundColor: {
                            color: 'rgb(255, 255, 255)',
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            // Save the chart as a PNG image
            const fs = require('fs');
            const out = fs.createWriteStream(dirname + `/temp/${msg.author.id}.png`);
            const stream = canvas.createPNGStream();
            stream.pipe(out);

            // Send embed to user
            out.on('finish', () => {
                const analyticsResult = analytics(playerdata[msg.author.id])
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Score of ${client.users.get(msg.author.id).username}`)
                    .setColor(parseInt(Base_Lang.status.info, 16))
                    .setDescription(`Current: \`${analyticsResult.current}\`\n`
                        + `Highest Score: \`${analyticsResult.max}\`\n`
                        + `Longest Streak: \`${analyticsResult.streak}\`\n`
                        + `Correct Answers: \`${analyticsResult.correct}\`\n\n`
                        + `Mean: \`${analyticsResult.mean}\`\n`
                        + `Median: \`${analyticsResult.median}\`\n`)
                    .setImage(`attachment://${msg.author.id}.png`);
                msg.channel.send({
                    embeds: [embed],
                    files: [{
                        attachment: dirname + `/temp/${msg.author.id}.png`,
                        name: `${msg.author.id}.png`
                    }]
                });
            });
        } else {
            msg.channel.send({
                embed: {
                    color: parseInt(Base_Lang.status.warning, 16),
                    description: "Your data is not found in the database."
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
