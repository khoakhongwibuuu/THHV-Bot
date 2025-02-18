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

const emojiTable = Object.freeze({
    up: '<:002_cute:1341258059296538677>',
    down: '<:sad_cat:1341256932589178911>',
    double: '<:umaru_cool:1341256937676865587>',
    immunity: '<:saitama_ok:1341257184960450572>',
    skipped: '<:surprised_pikachu:1341256950536605717>'
});

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

        Object.keys(responseData).forEach(id => { if (responseData[id] === key) correct.push(id); else incorrect.push(id); });

        // players that answered incorrectly and DO NOT have Immunity
        const loseList = incorrect.filter(id => !immunityList.includes(id));

        // players that answered incorrectly but have Immunity
        const immuneList = incorrect.filter(id => immunityList.includes(id));

        // players that answered correctly but DO NOT have Double Rewards
        const winList = correct.filter(id => !doubleRewardList.includes(id))

        // players that answered correctly and have Double Rewards
        const doubleWinList = correct.filter(id => doubleRewardList.includes(id));

        // players that are eligible to receice a BOOST (do NOT have any BOOST)
        const eligible = correct.filter(id => !doubleRewardList.includes(id) && !immunityList.includes(id));

        let Content = `:alarm_clock:  Hết giờ! Đáp án là \`${key}\`\n`;

        if (winList.length > 0) {
            Content += `Các người chơi trả lời đúng và nhận được \`${gameSetting.score.up}\` điểm ${emojiTable.up}: ${winList.argList("mention")}\n`;
        }
        if (doubleWinList.length > 0) {
            Content += `Các người chơi trả lời đúng và nhận được \`${gameSetting.score.up * 2}\` điểm ${emojiTable.double}: ${doubleWinList.argList("mention")}\n`;
        }
        if (loseList.length > 0) {
            Content += `Các người chơi trả lời sai và bị trừ \`${Math.abs(gameSetting.score.down)}\` điểm ${emojiTable.down}: ${loseList.argList("mention")}\n`;
        }
        if (immuneList.length > 0) {
            Content += `Các người chơi trả lời sai và bị mất phép bổ trợ \`Miễn nhiễm\` ${emojiTable.immunity}: ${immuneList.argList("mention")}\n`;
        }
        if (!responseData.hasOwnProperty(interaction.user.id)) {
            if (!immunityList.includes(interaction.user.id)) {
                Content += `<@${interaction.user.id}> lấy bài nhưng không làm, phí phạm tài nguyên. Trừ \`${Math.abs(gameSetting.score.down)}\` điểm ${emojiTable.skipped}.`;
                loseList.push(interaction.user.id);
            } else {
                Content += `<@${interaction.user.id}> lấy bài nhưng không làm, phí phạm tài nguyên. Xóa phép bổ trợ \`Miễn nhiễm\` ${emojiTable.skipped}.`;
                immuneList.push(interaction.user.id);
            }
        }

        interaction.followUp({ content: Content, ephemeral: false });

        let thisInstancePlayerId = null;
        let thisInstanceBoostId = 0;

        if (eligible.length > 0) {
            // Probability of a player receiving a reward: 10% + 5% per 1 eligible player, Maximum Rate : 75%

            const DEBUG_MODE = false;
            let luck = (DEBUG_MODE)
                ? generateLuckData(eligible, 100)
                : generateLuckData(eligible, Math.min(10 + gameSetting.score.boostRate * eligible.length, 75));

            if (luck.boostId !== 0) {
                thisInstanceBoostId = luck.boostId;
                thisInstancePlayerId = luck.playerId;

                interaction.followUp({
                    embeds: [new Discord.EmbedBuilder()
                        .setDescription(`GG <@${luck.playerId}>! Bạn đã nhận được phép bổ trợ ${luck.boostId === 1 ? "\`Nhân đôi phần thưởng\`" : "\`Miễn nhiễm\`"}.\nTác dụng: `
                            + ((luck.boostId === 1) ? `Nhân đôi số điểm thưởng khi bạn trả lời đúng.` : `Bảo vệ bạn khỏi 1 lượt bị trừ điểm.`)
                        )
                    ]
                });
            }
        }

        mcLib.bulkSaveInstaceResult(interaction.guild.id, {
            win: winList,
            doubleWin: doubleWinList,
            lose: loseList,
            immune: immuneList,
            boostReceiver: {
                playerId: thisInstancePlayerId,
                boostId: thisInstanceBoostId
            }
        });

        mcLib.guildUnlock(interaction.guild.id);
    }
}

module.exports = {
    execute
}