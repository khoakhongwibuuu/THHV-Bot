const fs = require('fs');
// Basic
const client = global.client;
const Config = global.Config;
const Lang = global.Lang;
const Utils = global.Utils;
const Base_Lang = global.Base_Lang;

// Load game configuration
const gamesetting = JSON.parse(fs.readFileSync(__dirname + '/setting/game.json', 'utf8'));

const execute = (msg, Datablock, index) => {
    // Load game libraries
    const GameLib = require(__dirname + '/lib/standardLib.js');

    // Variables
    const validkey = ['🇦', '🇧'];
    const ETA = gamesetting.ETA + gamesetting.mode[GameLib.decoder(Datablock.results[index].difficulty)];

    // Random ID
    const sessionID = Utils.clockBasedRandom(0, 4095) + 1;

    // Generate Answer Key
    const correctKey = GameLib.decoder(Datablock.results[index].correct_answer);

    // Generate content
    let Content = () => "True or False ? \n🇦 True \n🇧 False"

    // Deliver
    msg.channel.send(
        `:alarm_clock: You have \`${ETA}\` seconds for this question.`
        + `\nTopic: \`${GameLib.decoder(Datablock.results[index].category)}\``
        + `\nDifficulty: \`${GameLib.decoder(Datablock.results[index].difficulty)}\``,
        {
            embed: {
                color: parseInt(Base_Lang.status.info, 16),
                title: `${GameLib.decoder(Datablock.results[index].question)}`,
                description: Content(),
                footer: {
                    iconURL: msg.author.displayAvatarURL(),
                    text: `Requested by ${msg.author.username}`
                }
            }
        }).then(sentMessage => {
            sentMessage.react(validkey[0])
                .then(() => sentMessage.react(validkey[1]))
            const filter = (reaction, user) => validkey.includes(reaction.emoji.name);
            let voters = new Set();
            voters.add(client.user.id);
            let member_response = {};
            const collector = sentMessage.createReactionCollector(filter, { time: ETA * 1000 });
            collector.on('collect', (reaction, user) => {
                if (!voters.has(user.id) && validkey.includes(reaction._emoji.name)) {
                    voters.add(user.id);
                    member_response[user.id] = GameLib.keyCompiler(reaction._emoji.name, "boolean");
                }
            });
            collector.on('end', collected => {
                require(__dirname + '/judge.js').handle(msg, correctKey, member_response, sessionID);
            });
        });
}

module.exports.execute = execute;