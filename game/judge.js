// Special Library
const fs = require('fs');

// Basic variables
const client = global.client;
const Utils = global.Utils;
const dirname = global.dirname;

const handle = (msg, correctKey, member_response) => {
    const configAPIPath = dirname + '/api/configAPI.js';
    const serverAPIPath = dirname + '/api/serverAPI.js';
    const defaultLang = require(configAPIPath).loadDefaultLanguage();
    const server = require(serverAPIPath).loadRawData();

    // Load game library
    const GameLib = require(__dirname + '/lib/standardLib.js');

    // Load game configuration
    const gameSetting = GameLib.loadSetting();

    // List all CORRECT USERS and INCORRECT USERS
    let correctUser = [];
    let incorrectUser = [];
    let queuedUser = [];

    for (let ID in member_response) {
        if (member_response[ID] === correctKey) {
            correctUser.push(`<@${ID}>`);
        } else {
            incorrectUser.push(`<@${ID}>`);
        }
    }

    // CORRECT USERS and INCORRECT USERS as message content
    let draftA = ((correctUser.length > 0) ? `\nMember${correctUser.length > 1 ? "s" : ""} answered correctly :white_check_mark:: ${Utils.args_logging(correctUser, false)}` : "");
    let draftB = ((incorrectUser.length > 0) ? `\nMember${incorrectUser.length > 1 ? "s" : ""} answered incorrectly :x:: ${Utils.args_logging(incorrectUser, false)}` : "");
    let draftC = (!correctUser.includes(`<@${msg.author.id}>`) && !incorrectUser.includes(`<@${msg.author.id}>`) ? `\n<@${msg.author.id}> did not answer the question. Minus \`${Math.abs(gameSetting.down)}\` points.` : "")

    // Notify when the time is up
    msg.channel.send(`:alarm_clock:  Time's up!` + `\nCorrect answer is \`${correctKey}\`` + draftA + draftB + draftC);

    // fetching host
    const guild = client.guilds.get(server.host);

    // Save player data
    correctUser.forEach(e => {
        let userID = Utils.objectToID(e);
        GameLib.saveScore(userID, gameSetting.up);
        let loadedData = GameLib.readScore(userID);
        if (loadedData[loadedData.length - 1] >= 50) {
            const member = guild.members.get(userID);
            if (!member.roles.has(server.multiple_choice_grandmaster)) {
                queuedUser.push(`<@${userID}>`);
            }
        }
    });
    incorrectUser.forEach(e => GameLib.saveScore(Utils.objectToID(e), gameSetting.down));
    if (!correctUser.includes(`<@${msg.author.id}>`) && !incorrectUser.includes(`<@${msg.author.id}>`)) {
        GameLib.saveScore(Utils.objectToID(msg.author.id), gameSetting.down);
    }
    GameLib.unlock();
    
    // adding role
    if (server.multiple_choice_grandmaster != "") {
        const role = guild.roles.get(server.multiple_choice_grandmaster);
        queuedUser.forEach(e => {
            let userID = Utils.objectToID(e);
            msg.channel.send({
                embed: {
                    color: parseInt(defaultLang.status.info, 16),
                    description: `GG ${Utils.args_logging(queuedUser, false)}! You have received role <@&${server.multiple_choice_grandmaster}>`
                }
            });
            let member = guild.members.get(userID);
            member.roles.add(role);
        });
    }
}

module.exports.handle = handle;