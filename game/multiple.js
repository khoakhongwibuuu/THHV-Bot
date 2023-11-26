// Basic variables
const client = global.client;
const Utils = global.Utils;
const dirname = global.dirname;

const execute = (msg, Datablock, index) => {
    const configAPIPath = dirname + '/api/configAPI.js';
    const defaultLang = require(configAPIPath).loadDefaultLanguage();

    // Load game library
    const GameLib = require(__dirname + '/lib/standardLib.js');

    // Load game configuration
    const gameSetting = GameLib.loadSetting();

    // Variables
    const validKey = ['🇦', '🇧', '🇨', '🇩'];
    const ETA = gameSetting.ETA + gameSetting.mode[GameLib.decoder(Datablock.results[index].difficulty)];

    // Generate Answer Key
    let correctKeyIdx = Utils.clockBasedRandom(0, 3);
    const correctKey = validKey[correctKeyIdx];

    // Load incorrect answers
    let incorrectAnswer = Datablock.results[index].incorrect_answers;
    let incorrectIdx = 0;
    GameLib.shuffle(incorrectAnswer);

    // Generate content
    let Content = () => {
        let ret = ""
        validKey.forEach((OptionalKey, idx) => {
            ret += (`${OptionalKey} `
                + `${OptionalKey === correctKey ? GameLib.decoder(Datablock.results[index].correct_answer) : GameLib.decoder(incorrectAnswer[incorrectIdx++])}`
                + `${idx == 3 ? "" : "\n"}`);
        });
        return ret;
    }

    // Deliver
    msg.channel.send(
        `:alarm_clock: You have \`${ETA}\` seconds for this question.`
        + `\nTopic: \`${GameLib.decoder(Datablock.results[index].category)}\``
        + `\nDifficulty: \`${GameLib.decoder(Datablock.results[index].difficulty)}\``,
        {
            embed: {
                color: parseInt(defaultLang.status.info, 16),
                title: `${GameLib.decoder(Datablock.results[index].question)}`,
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
            const filter = (reaction, user) => validKey.includes(reaction.emoji.name);
            let voters = new Set();
            voters.add(client.user.id);
            let memberResposes = {};
            const collector = sentMessage.createReactionCollector(filter, { time: ETA * 1000 });
            collector.on('collect', (reaction, user) => {
                if (!voters.has(user.id) && validKey.includes(reaction._emoji.name)) {
                    voters.add(user.id);
                    memberResposes[user.id] = GameLib.keyCompiler(reaction._emoji.name, "multiple");
                }
            });
            collector.on('end', collected => {
                require(__dirname + '/judge.js').handle(msg, ['A', 'B', 'C', 'D'][correctKeyIdx], memberResposes);
            });
        });
}

module.exports.execute = execute;