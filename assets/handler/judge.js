const Discord = require('discord.js');
const dirname = global.dirname;
const stdlib = global.stdlib;

const execute = (interaction, responseData, key) => {
    const gameLib = require(dirname + '/assets/library/game.js');
    const serverLib = require(dirname + '/assets/library/server.js');

    const gameSetting = gameLib.loadSetting();
    const serverSetting = serverLib.load();

    let correct = [], incorrect = [], award = [];
    Object.keys(responseData).forEach(id => {
        if (responseData[id] === key) {
            correct.push(id);
            gameLib.saveScore(id, gameSetting.up);
        } else {
            incorrect.push(id);
            gameLib.saveScore(id, gameSetting.down);
        }
    });
    let Content = `:alarm_clock:  Time's up!\nCorrect answer is \`${key}\`\n`;
    if (correct.length > 0) {
        Content += `Member${(correct.length > 1) ? "s" : ""} answered correctly :white_check_mark:: ${correct.argList("mention")}\n`;
    }
    if (incorrect.length > 0) {
        Content += `Member${(correct.length > 1) ? "s" : ""} answered incorrectly :x:: ${incorrect.argList("mention")}\n`;
    }
    if (!responseData.hasOwnProperty(interaction.user.id)) {
        Content += `<@${interaction.user.id}> did not answer the question. Minus \`${Math.abs(gameSetting.down)}\` points.`
        gameLib.saveScore(interaction.user.id, gameSetting.down)
    }
    interaction.followUp({
        content: Content,
        ephemeral: false
    });

    if (gameSetting.rewardRole !== "") {
        const server = global.client.guilds.cache.get(serverSetting.guildID);
        const role = server.roles.cache.get(gameSetting.rewardRole);
        correct.forEach(userID => {
            const user = server.members.cache.get(userID);
            const currentUserScore = gameLib.readScore(userID).lastValue();
            if (currentUserScore >= 50 && !user.roles.cache.has(gameSetting.rewardRole)) {
                award.push(userID);
                user.roles.add(role);
            }
        });
        if (award.length > 0) {
            const embed = new Discord.EmbedBuilder()
                .setDescription(`GG ${award.argList("mention")}! You have received role <@&${gameSetting.rewardRole}>`);
            interaction.followUp({ embeds: [embed] });
        }
    }
    gameLib.unlock();
}

module.exports.execute = execute;