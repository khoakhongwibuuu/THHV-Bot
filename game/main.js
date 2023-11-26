// Basic
const client = global.client;
const Utils = global.Utils;
const dirname = global.dirname;

const main_module = (msg) => {
    const configAPIPath = dirname + '/api/configAPI.js';
    const defaultLang = require(configAPIPath).loadDefaultLanguage();
    const GameLib = require(__dirname + '/lib/standardLib.js');

    const frequencyMap = [
        9, 9, 9,    // General Knowledge
        17, 17, 17, // Nature Science
        18, 18, 18, // Computer Science
        19, 19,     // Math
        22,         // Geography
        23,         // History
        27,         // Animals
        30, 30, 30, // Gadgets
        31, 31      // Anime
    ];

    fetch(`https://opentdb.com/api.php?amount=1&encode=url3986&category=${frequencyMap[Math.floor(frequencyMap.length * Math.random())]}`)
        .then(response => response.json())
        .then(Datablock => {
            msg.react('⌛');
            let index = 0;
            if (GameLib.decoder(Datablock.results[index].type.toString()) === "multiple")
                require(__dirname + '/multiple.js').execute(msg, Datablock, index);
            else
                require(__dirname + '/boolean.js').execute(msg, Datablock, index);
        })
        .catch(error => {
            msg.react('⚠️');
            GameLib.unlock()
            console.log(error);
            msg.channel.send({
                embed: {
                    color: parseInt(defaultLang.status.warning, 16),
                    description: `:warning: ${error.cause.code}`
                }
            });
        });
}

const execute = (msg, para, cmd) => {
    const configAPIPath = dirname + '/api/configAPI.js';
    const defaultLang = require(configAPIPath).loadDefaultLanguage();
    const lang = require(configAPIPath).loadLanguage();
    const GameLib = require(__dirname + '/lib/standardLib.js');

    if (msg.channel.type === 'text') {
        if (!msg.channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;
        if (cmd === "play") {
            if (para.length === 0) {
                if (GameLib.loadStatus() === false) {
                    GameLib.lock();
                    main_module(msg);
                }
                else {
                    msg.react('⚠️');
                    msg.channel.send({
                        embed: {
                            color: parseInt(defaultLang.status.warning, 16),
                            description: `Another session is running. Please wait!`,
                        }
                    });
                }
            }
            else {
                msg.react('⚠️');
                msg.channel.send({
                    embed: {
                        color: parseInt(defaultLang.status.warning, 16),
                        description: `:warning: ${lang.error.parameter}`
                    }
                });
            }
        }
        else {
            let modulePath = __dirname + `/modules/${cmd}.js`
            require(modulePath).execute(msg, para);
        }
    }
    else {
        msg.react('⚠️');
        msg.channel.send({
            embed: {
                color: parseInt(defaultLang.status.error, 16),
                description: `:warning: ${lang.error.DM}`,
            }
        });
    }
}

module.exports.execute = execute;