// Basic variables
const client = global.client;
const Utils = global.Utils;
const dirname = global.dirname;

const execute = (msg, para) => {
    const configAPIPath = dirname + '/api/configAPI.js';
    const defaultLang = require(configAPIPath).loadDefaultLanguage();
    const lang = require(configAPIPath).loadLanguage();

    if (para.length < 2) {
        const GameLib = require(dirname + '/game/lib/standardLib.js');
        const userID = (para.length === 0) ? msg.author.id : Utils.objectToID(para[0]);
        let loadedData = GameLib.readScore(userID);
        if (loadedData !== "Unknown") {
            msg.react('⌛');
            msg.channel.send({
                embed: {
                    color: parseInt(defaultLang.status.info, 16),
                    description: `<@${userID}> : \`${loadedData[loadedData.length - 1]}\``
                }
            });
        } else {
            msg.react('⚠️');
            msg.channel.send({
                embed: {
                    color: parseInt(defaultLang.status.warning, 16),
                    description: (Utils.isNum(userID)) ? `:warning: ${(userID === msg.author.id) ? "Your" : `<@${userID}>'s`} data is not found in the database.` : "Please use User ID or Mentions instead."
                }
            });
        }
    } else {
        msg.react('⚠️');
        msg.channel.send({
            embed: {
                color: parseInt(defaultLang.status.warning, 16),
                description: `:warning: ${lang.error.parameter}`
            }
        });
    }
}

module.exports.execute = execute;
