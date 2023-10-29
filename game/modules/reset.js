const fs = require('fs');
// Basic
const client = global.client;
const Config = global.Config;
const Lang = global.Lang;
const Utils = global.Utils;
const Base_Lang = global.Base_Lang;

const dirname = global.dirname;

// Load game libraries


const execute = (msg, para) => {
    const GameLib = require(dirname + '/game/lib/standardLib.js');
    if (Config.owner.includes(msg.author.id)) {
        const playerDatapath = dirname + '/configs/playerdata.json';
        const playerdata = JSON.parse(fs.readFileSync(playerDatapath, 'utf8'));
        if (para.length === 0) {
            // case: that player data is NOT found in the database
            msg.channel.send({
                embed: {
                    color: parseInt(Base_Lang.status.warning, 16),
                    description: `:warning: This command requires you to provide the user's ID.\nFor example: \n--reset ${msg.author.id} \nor \n--reset <@${msg.author.id}>`
                }
            });
        } else if (para.length === 1) {
            let id = Utils.objectToID(para[0]);
            let tempscore = GameLib.getUserdata(id);
            if (tempscore !== "Unknown") {
                // case: that player data is found in the database and the input is valid (only accept @mention or UserID)
                delete playerdata[id];
                msg.channel.send({
                    embed: {
                        color: parseInt(Base_Lang.status.info, 16),
                        description: `<@${id}>'s data has been deleted.`
                    }
                });
                console.log(playerdata);
                fs.writeFileSync(playerDatapath, JSON.stringify(playerdata, null, 2));
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
            msg.channel.send({
                embed: {
                    color: parseInt(Base_Lang.status.warning, 16),
                    description: `:warning: ${Lang.error.parameter}`
                }
            });
        }
    } else {
        msg.channel.send({
            embed: {
                color: parseInt(Base_Lang.status.error, 16),
                description: `:no_entry: ${Lang.denied.owner}`,
            }
        });
    }
}

module.exports.execute = execute;
