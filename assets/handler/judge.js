const Discord = require('discord.js');
const dirname = global.dirname;
const stdlib = global.stdlib;

const grantPU = (userArr, rndRate) => {
    let ret = []
    if (stdlib.randomEvent(rndRate) === true) {
        const gameLib = require(dirname + '/assets/library/game.js');
        const type = (stdlib.clockBasedRandom(1, 2) === 2 ? "saver" : "twice")
        if (userArr.length > 0) {
            stdlib.shuffle(userArr);
            gameLib.addBoost(userArr[0], type);
            ret.push(userArr[0]);
            ret.push(type);
        } else {
            ret.push(-1);
        }
    } else {
        ret.push(-1);
    }
    return ret;
}

const execute = (interaction, responseData, key) => {
    const gameLib = require(dirname + '/assets/library/game.js');
    const serverLib = require(dirname + '/assets/library/server.js');

    const gameSetting = gameLib.loadSetting();
    const serverSetting = serverLib.load();

    let correct = [], incorrect = [];
    const double = gameLib.readBoost("twice");
    const immunity = gameLib.readBoost("saver");

    Object.keys(responseData).forEach(id => {
        if (responseData[id] === key) {
            correct.push(id);
        } else {
            incorrect.push(id);
        }
    });

    const scoreDecrease = incorrect.filter(e => !immunity.includes(e));
    const scoreIntact = incorrect.filter(e => immunity.includes(e));

    const eligible = correct.filter(e => !double.includes(e) && !immunity.includes(e));
    const scoreDouble = correct.filter(e => double.includes(e));

    let Content = `:alarm_clock:  Time's up! Correct answer is \`${key}\`\n`;

    if (eligible.length > 0) {
        Content += `Member${(eligible.length > 1) ? "s" : ""} answered correctly and gained \`${gameSetting.up}\` points :white_check_mark:: ${eligible.argList("mention")}\n`;
        eligible.forEach(id => {
            gameLib.saveScore(id, gameSetting.up);
        });
    }
    if (scoreDouble.length > 0) {
        Content += `Member${(scoreDouble.length > 1) ? "s" : ""} answered correctly and gained \`${gameSetting.up * 2}\` points :ballot_box_with_check:: ${scoreDouble.argList("mention")}\n`;
        scoreDouble.forEach(id => {
            gameLib.saveScore(id, gameSetting.up * 2);
            gameLib.removeBoost(id, "twice");
        });
    }
    if (scoreDecrease.length > 0) {
        Content += `Member${(scoreDecrease.length > 1) ? "s" : ""} answered incorrectly and lost \`${Math.abs(gameSetting.down)}\` points :x:: ${scoreDecrease.argList("mention")}\n`;
        scoreDecrease.forEach(id => {
            gameLib.saveScore(id, gameSetting.down);
        });
    }
    if (scoreIntact.length > 0) {
        Content += `Member${(scoreDecrease.length > 1) ? "s" : ""} answered incorrectly and lost their \`Immunity\` auxiliary :ring_buoy:: ${scoreIntact.argList("mention")}\n`;
        scoreIntact.forEach(id => {
            gameLib.saveScore(id, gameSetting.down * 0);
            gameLib.removeBoost(id, "saver");
        });
    }
    if (!responseData.hasOwnProperty(interaction.user.id)) {
        if (!immunity.includes(interaction.user.id)) {
            Content += `<@${interaction.user.id}> did not respond to their requested question and lost \`${Math.abs(gameSetting.down)}\` points.`;
            scoreDecrease.push(interaction.user.id);
            gameLib.saveScore(interaction.user.id, gameSetting.down);
        } else {
            Content += `<@${interaction.user.id}> did not respond to their requested question and lost their \`Immunity\` auxiliary.`;
            gameLib.removeBoost(interaction.user.id, "saver");
        }
    }

    interaction.followUp({
        content: Content,
        ephemeral: false
    });

    let luck = grantPU(eligible, gameSetting.boostRate);
    if (luck.length === 2) {
        const embed = new Discord.EmbedBuilder()
            .setDescription(`GG <@${luck[0]}>! You have received ${luck[1] === "twice" ? "\`Double Reward\`" : "\`Immunity\`"}. `
                + `This will be activated on your next ${luck[1] === "twice" ? "correct" : "incorrect"} answer.`);
        interaction.followUp({ embeds: [embed] });
    }

    const server = global.client.guilds.cache.get(serverSetting.guildID);


    if (gameSetting.rewardRole !== "") {
        let awardTrophy = [];
        const role = server.roles.cache.get(gameSetting.rewardRole);
        correct.forEach(userID => {
            const user = server.members.cache.get(userID);
            const currentUserScore = gameLib.readScore(userID).lastValue();
            if (currentUserScore >= 50 && !user.roles.cache.has(gameSetting.rewardRole)) {
                awardTrophy.push(userID);
                user.roles.add(role);
            }
        });
        if (awardTrophy.length > 0) {
            const embed = new Discord.EmbedBuilder()
                .setDescription(`GG ${awardTrophy.argList("mention")}! You have received role <@&${gameSetting.rewardRole}> for reaching 50 points.`);
            interaction.followUp({ embeds: [embed] });
        }
    }

    if (gameSetting.trashRole !== "") {
        let awardTrash = [];
        const role = server.roles.cache.get(gameSetting.trashRole);
        scoreDecrease.forEach(userID => {
            const user = server.members.cache.get(userID);
            const currentUserScore = gameLib.readScore(userID).lastValue();
            if (currentUserScore <= -50 && !user.roles.cache.has(gameSetting.trashRole)) {
                awardTrash.push(userID);
                user.roles.add(role);
            }
        });
        if (awardTrash.length > 0) {
            const embed = new Discord.EmbedBuilder()
                .setDescription(`GG ${awardTrash.argList("mention")}! You have received role <@&${gameSetting.trashRole}> for reaching -50 points.`);
            interaction.followUp({ embeds: [embed] });
        }
    }
    gameLib.unlock();
}

module.exports.execute = execute;