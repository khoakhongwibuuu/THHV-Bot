const fs = require('fs');
// Basic
const client = global.client;
const Config = global.Config;
const Lang = global.Lang;
const Utils = global.Utils;
const Base_Lang = global.Base_Lang;
const dirname = global.dirname;

const execute = (msg, para) => {
    if (para.length < 2) {
        const GameLib = require(dirname + '/game/lib/standardLib.js');
        const userID = (para.length === 0) ? msg.author.id : Utils.objectToID(para[0]);
        let loadedData = GameLib.readScore(userID);
        if (loadedData !== "Unknown") {
            msg.channel.send({
                embed: {
                    color: parseInt(Base_Lang.status.info, 16),
                    description: `<@${userID}> : \`${loadedData[loadedData.length - 1]}\``
                }
            });
        } else {
            msg.channel.send({
                embed: {
                    color: parseInt(Base_Lang.status.warning, 16),
                    description: (Utils.isNum(userID)) ? `${(userID === msg.author.id) ? "Your " : `<@${userID}>`} data is not found in the database.` : "Please use User ID or Mentions instead."
                }
            });
        }
    } else {
        // Invalid parameter to handle
        msg.channel.send({
            embed: {
                color: parseInt(Base_Lang.status.warning, 16),
                description: `:warning: ${Lang.error.parameter}`
            }
        });
    }
}

module.exports.execute = execute;
