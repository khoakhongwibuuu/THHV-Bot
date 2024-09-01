const path = require('path');
const Discord = require('discord.js');

// Universal
const dirname = global.dirname;
const stdlib = global.stdlib;
const discordAPI = global.discordAPI;

// Module Specified
const mcLib = require(path.join(dirname, 'modules/multiple-choice/lib/gameLib.js'));

const generateLuckData = (eligiblePlayer, rndRate) => {
    const rateMet = stdlib.randomPercent(rndRate);
    return {
        playerId: (rateMet) ? eligiblePlayer.randomValue() : null,
        boostId: (rateMet) ? stdlib.trueRnd(0, 1) + 1 : 0
    }
}

const execute = (interaction, responseData, key) => {
    const gameSetting = mcLib.loadGuildFile(interaction.guild.id).setting;

    if (!mcLib.isRunning(interaction.guild.id)) {
        // Only when server moderator use /stop,
        interaction.followUp({
            content: "Có vẻ như một người điều hành máy chủ đã buộc dừng lượt chơi này, do đó kết quả của lượt chơi sẽ bị hủy."
        });
    } else {
        let correct = [], incorrect = [];
        const boostList = mcLib.bulkBoostLoad(interaction.guild.id);
        const doubleRewardList = boostList.doubleReward, immunityList = boostList.immunity;

        Object.keys(responseData).forEach(id => {
            if (responseData[id] === key) {
                correct.push(id);
            } else {
                incorrect.push(id);
            }
        });

        // players that answered incorrectly and DO NOT have Immunity
        const scoreDecrease = incorrect.filter(e => !immunityList.includes(e));

        // players that answered incorrectly but have Immunity
        const scoreIntact = incorrect.filter(e => immunityList.includes(e));

        // players that answered correctly but DO NOT have Double Rewards
        const normalCorrect = correct.filter(e => !doubleRewardList.includes(e))

        // players that answered correctly and have Double Rewards
        const doubleCorrect = correct.filter(e => doubleRewardList.includes(e));

        // players that are eligible to receice a BOOST (do NOT have any BOOST)
        const eligible = correct.filter(e => !doubleRewardList.includes(e) && !immunityList.includes(e));

        let Content = `:alarm_clock:  Hết giờ! Đáp án là \`${key}\`\n`;

        if (normalCorrect.length > 0) {
            Content += `Các người chơi trả lời đúng và nhận được \`${gameSetting.score.up}\` điểm <:orz:699067454671945758>: ${normalCorrect.argList("mention")}\n`;
        }
        if (doubleCorrect.length > 0) {
            Content += `Các người chơi trả lời đúng và nhận được \`${gameSetting.score.up * 2}\` điểm <:woah:700342674129027112>: ${doubleCorrect.argList("mention")}\n`;
            mcLib.savePlayerBoost(interaction.guild.id, interaction.user.id, 0);
        }
        if (scoreDecrease.length > 0) {
            Content += `Các người chơi trả lời sai và bị trừ \`${Math.abs(gameSetting.score.down)}\` điểm <:holyfuck:700342674166775870>: ${scoreDecrease.argList("mention")}\n`;
        }
        if (scoreIntact.length > 0) {
            Content += `Các người chơi trả lời sai và bị mất phép bổ trợ \`Miễn nhiễm\` <:haiyaa:858314284752568322>: ${scoreIntact.argList("mention")}\n`;
            scoreIntact.forEach(id => {
                mcLib.savePlayerBoost(interaction.guild.id, id, 0);
            });
        }
        if (!responseData.hasOwnProperty(interaction.user.id)) {
            if (!immunityList.includes(interaction.user.id)) {
                Content += `<@${interaction.user.id}> lấy bài nhưng không làm, phí phạm tài nguyên. Trừ \`${Math.abs(gameSetting.score.down)}\` điểm <:thinkingcat:700345519398060073>.`;
                scoreDecrease.push(interaction.user.id);
            } else {
                Content += `<@${interaction.user.id}> lấy bài nhưng không làm, phí phạm tài nguyên. Xóa phép bổ trợ \`Miễn nhiễm\` <:thinkingcat:700345519398060073>.`;
                mcLib.savePlayerBoost(interaction.guild.id, interaction.user.id, 0);
                scoreIntact.push(interaction.user.id);
            }
        }

        mcLib.bulkSavePlayerScore(interaction.guild.id, {
            win: normalCorrect,
            doubleWin: doubleCorrect,
            lose: scoreDecrease,
            immune: scoreIntact
        });

        interaction.followUp({
            content: Content,
            ephemeral: false
        });

        if (eligible.length > 0) {
            // Probability of a player receiving a reward: 10% + 5% per 1 eligible player, Maximum Rate : 75%
            let luck = generateLuckData(eligible, Math.min(10 + gameSetting.score.boostRate * eligible.length, 75));
            // let luck = generateLuckData(eligible, 100);
            if (luck.playerId !== null) {
                mcLib.savePlayerBoost(interaction.guild.id, luck.playerId, luck.boostId);
                interaction.followUp({
                    embeds: [new Discord.EmbedBuilder()
                        .setDescription(`GG <@${luck.playerId}>! Bạn đã nhận được phép bổ trợ ${luck.boostId === 1 ? "\`Nhân đôi phần thưởng\`" : "\`Miễn nhiễm\`"}.\nTác dụng: `
                            + ((luck.boostId === 1) ? `Nhân đôi số điểm thưởng khi bạn trả lời đúng. <:pinkUwU:1269159930645053483>` : `Bảo vệ bạn khỏi 1 lượt bị trừ điểm. <:no_u:855441146167820340>`)
                        )
                    ]
                });
            }
        }

        mcLib.guildUnlock(interaction.guild.id);
    }
}

module.exports.execute = execute;