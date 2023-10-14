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

// Variables
const compiledkey = ['A', 'B', 'C', 'D'];
const validkey = ['🇦', '🇧', '🇨', '🇩'];
const ETA = gamesetting.ETA;

const execute = (msg, Datablock, index) => {
    console.log("type: multiple");
    // Random ID
    const sessionID = Utils.clockBasedRandom(0, 4095) + 1;

    // Generate Answer Key
    const correctKey = compiledkey[Utils.clockBasedRandom(0, 3)];

    // Load incorrect answers
    let incorrectAnswer = Datablock.results[index].incorrect_answers;
    let incorrectIdx = 0;
    GameLib.shuffle(incorrectAnswer);

    // Generate content
    let Content = () => {
        let ret = ""
        compiledkey.forEach((OptionalKey, idx) => {
            ret += (`${OptionalKey}. `
                + `${OptionalKey === correctKey ? GameLib.decoder(Datablock.results[index].correct_answer) : GameLib.decoder(incorrectAnswer[incorrectIdx++])}`
                + `${idx == 3 ? "" : "\n"}`);
        });
        return ret;
    }
    // Deliver
    msg.channel.send(
        `:alarm_clock: You have \`${ETA}\` seconds for this question.`
        + `\nTopic: \`${Datablock.results[index].category}\``
        + `\nDifficulty: \`${Datablock.results[index].difficulty}\``,
        {
            embed: {
                color: parseInt(Base_Lang.status.info, 16),
                title: `Session ${sessionID}: ${GameLib.decoder(Datablock.results[index].question)}`,
                description: Content(),
                footer: {
                    iconURL: msg.author.displayAvatarURL(),
                    text: `Requested by ${msg.author.username}`
                }
            }
        }).then(sentMessage => {
            sentMessage.react('🇦')
                .then(() => sentMessage.react('🇧'))
                .then(() => sentMessage.react('🇨'))
                .then(() => sentMessage.react('🇩'));
            const filter = (reaction, user) => validkey.includes(reaction.emoji.name);
            let voters = new Set();
            voters.add(client.user.id);
            let member_response = {};
            const collector = sentMessage.createReactionCollector(filter, { time: ETA * 1000 });
            collector.on('collect', (reaction, user) => {
                if (!voters.has(user.id) && validkey.includes(reaction._emoji.name)) {
                    voters.add(user.id);
                    member_response[user.id] = GameLib.keyCompiler(reaction._emoji.name, "multiple");
                }
            });
            collector.on('end', collected => {
                require(__dirname +'/judge.js').handle(msg, correctKey, member_response, sessionID);
            });
        });
}

module.exports.execute = execute;