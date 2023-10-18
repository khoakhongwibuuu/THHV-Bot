const fs = require('fs');
// Basic
const client = global.client;
const Config = global.Config;
const Lang = global.Lang;
const Utils = global.Utils;
const Base_Lang = global.Base_Lang;

// Load game configuration
const gamesetting = JSON.parse(fs.readFileSync(__dirname + '/setting/game.json', 'utf8'));

// Load game libraries
const GameLib = require(__dirname + '/lib/standardLib.js');

const handle = (msg, correctKey, member_response, sessionID) => {
    // List all CORRECT USERS and INCORRECT USERS
    let correctUser = [];
    let incorrectUser = [];
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
    let draftC = (!correctUser.includes(`<@${msg.author.id}>`) && !incorrectUser.includes(`<@${msg.author.id}>`) ? `\n<@${msg.author.id}> did not answer the question. Minus \`${Math.abs(gamesetting.down)}\` points.` : "")

    // Notify when the time is up
    msg.channel.send(`**Session ${sessionID}**: :alarm_clock:  Time's up!` + `\nCorrect answer is \`${correctKey}\`` + draftA + draftB + draftC);

    // Save player data
    correctUser.forEach(e => {
        GameLib.saveResult(Utils.objectToID(e), gamesetting.up);
    });
    incorrectUser.forEach(e => {
        GameLib.saveResult(Utils.objectToID(e), gamesetting.down);
    });
    if (!correctUser.includes(`<@${msg.author.id}>`) && !incorrectUser.includes(`<@${msg.author.id}>`)) {
        GameLib.saveResult(Utils.objectToID(msg.author.id), gamesetting.down);
    }

    GameLib.savegamedata();
}

module.exports.handle = handle;