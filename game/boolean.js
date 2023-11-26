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
    const validKey = ['🇦', '🇧'];
    const ETA = gameSetting.ETA + gameSetting.mode[GameLib.decoder(Datablock.results[index].difficulty)];

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
                color: parseInt(defaultLang.status.info, 16),
                title: `${GameLib.decoder(Datablock.results[index].question)}`,
                description: Content(),
                footer: {
                    iconURL: msg.author.displayAvatarURL(),
                    text: `Requested by ${msg.author.username}`
                }
            }
        }).then(sentMessage => {
            sentMessage.react(validKey[0])
                .then(() => sentMessage.react(validKey[1]))
            const filter = (reaction, user) => validKey.includes(reaction.emoji.name);
            let voters = new Set();
            voters.add(client.user.id);
            let memberResposes = {};
            const collector = sentMessage.createReactionCollector(filter, { time: ETA * 1000 });
            collector.on('collect', (reaction, user) => {
                if (!voters.has(user.id) && validKey.includes(reaction._emoji.name)) {
                    voters.add(user.id);
                    memberResposes[user.id] = GameLib.keyCompiler(reaction._emoji.name, "boolean");
                }
            });
            collector.on('end', collected => {
                require(__dirname + '/judge.js').handle(msg, correctKey, memberResposes);
            });
        });
}

module.exports.execute = execute;