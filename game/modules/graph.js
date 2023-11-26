// Special library
const Discord = require('discord.js');

// Basic variables
const client = global.client;
const Utils = global.Utils;
const dirname = global.dirname;

const lang = global.lang;
const defaultLang = global.defaultLang;

const execute = (msg, para) => {
    const configAPIPath = dirname + '/api/configAPI.js';
    const defaultLang = require(configAPIPath).loadDefaultLanguage();
    const lang = require(configAPIPath).loadLanguage();

    if (para.length < 2) {
        const GameLib = require(dirname + '/game/lib/standardLib.js');
        const userID = (para.length === 0) ? msg.author.id : Utils.objectToID(para[0]);
        let loadedData = GameLib.readScore(userID);
        if (loadedData !== "Unknown") {
            msg.react('⌛');
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

            // Image size
            const width = 1440;
            const height = 720;

            let analyticsResult = {}, maxLength = 1, length = 1, correct = 0, datasize = loadedData.length;
            for (let i = 1; i < datasize; i++) {
                if (loadedData[i] > loadedData[i - 1]) {
                    length++;
                    correct++;
                } else {
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

            msg.channel.send({
                embeds: [new Discord.MessageEmbed()
                    .setTitle(`Score of ${client.users.get(userID).username}`)
                    .setColor(parseInt(defaultLang.status.info, 16))
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
            msg.react('⚠️');
            msg.channel.send({
                embed: {
                    color: parseInt(defaultLang.status.warning, 16),
                    description: (Utils.isNum(userID)) ? `:warning: ${(userID === msg.author.id) ? "Your" : `<@${userID}>'s`} data is not found in the database.` : "Please use User ID or Mentions instead."
                }
            });
        }
    } else {
        msg.react('⚠️');
        msg.channel.send({
            embed: {
                color: parseInt(defaultLang.status.warning, 16),
                description: `:warning: ${lang.error.parameter}`
            }
        });
    }
}

module.exports.execute = execute;
