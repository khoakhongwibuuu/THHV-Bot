const fs = require('fs');
// Basic
const client = global.client;
const Config = global.Config;
const Lang = global.Lang;
const Utils = global.Utils;
const Base_Lang = global.Base_Lang;

const dirname = global.dirname;

// Load game libraries
const GameLib = require(dirname + '/game/lib/standardLib.js');

const execute = (msg, para) => {
    if (para.length === 1) {
        // when a user retrieve their data from the database
        // get that user data
        let tempscore = GameLib.getUserdata(msg.author.id.toString());
        if (tempscore !== "Unknown") {
            // case: that player data is found in the database
            msg.channel.send({
                embed: {
                    color: parseInt(Base_Lang.status.info, 16),
                    description: `<@${msg.author.id}> : \`${tempscore}\``
                }
            });
        } else {
            // case: that player data is NOT found in the database
            msg.channel.send({
                embed: {
                    color: parseInt(Base_Lang.status.warning, 16),
                    description: "Your data is not found in the database."
                }
            });
        }
    } else if (para.length === 2) {
        // when a user retrieve another player data from the database
        // get that user data
        let id = Utils.objectToID(para[1]);
        let tempscore = GameLib.getUserdata(id);
        if (tempscore !== "Unknown") {
            // case: that player data is found in the database and the input is valid (only accept @mention or UserID)
            msg.channel.send({
                embed: {
                    color: parseInt(Base_Lang.status.info, 16),
                    description: `<@${id}> : \`${tempscore}\``
                }
            });
        } else {
            // case: that player data is NOT found in the database or the input is invalid
            msg.channel.send({
                embed: {
                    color: parseInt(Base_Lang.status.warning, 16),
                    description: (GameLib.isNum(id)) ? "That player\'s data is not found in the database." : "Please use User ID or Mentions instead."
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
