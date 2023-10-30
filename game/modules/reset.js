const fs = require('fs');
// Basic
const client = global.client;
const Config = global.Config;
const Lang = global.Lang;
const Utils = global.Utils;
const Base_Lang = global.Base_Lang;
const dirname = global.dirname;

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
            if (para[0] === "all") {
                msg.channel.send({
                    embed: {
                        color: parseInt(Base_Lang.status.warning, 16),
                        description: `:warning: This is a destructive action, do you want to continue?`
                    }
                })
                .then(sentMessage => {
                    sentMessage.react('✅')
                        .then(() => sentMessage.react('❌'));
                    const filter = (reaction, user) => ['✅', '❌'].includes(reaction.emoji.name);
                    const collector = sentMessage.createReactionCollector(filter, { time: 5000 });
                    let voters = new Set();
                    voters.add(client.user.id);
                    collector.on('collect', (reaction, user) => {
                        if (!voters.has(user.id) && ['✅', '❌'].includes(reaction._emoji.name)) {
                            if (Config.owner.includes(user.id)) {
                                voters.add(user.id);
                                if (reaction._emoji.name === '✅') {
                                    Object.keys(playerdata).forEach(key => delete playerdata[key]);
                                    fs.writeFileSync(playerDatapath, JSON.stringify(playerdata, null, 2));
                                    msg.channel.send({
                                        embed: {
                                            color: parseInt(Base_Lang.status.success, 16),
                                            description: `Task finished successfully.`
                                        }
                                    });
                                } else {
                                    msg.channel.send({
                                        embed: {
                                            color: parseInt(Base_Lang.status.info, 16),
                                            description: `The request was cancelled by the user.`
                                        }
                                    });
                                }
                            }
                        }
                    });
                    collector.on('end', collected => {
                        if (voters.size === 1)
                            msg.channel.send({
                                embed: {
                                    color: parseInt(Base_Lang.status.info, 16),
                                    description: `The request was cancelled automatically.`
                                }
                            });
                        sentMessage.delete();
                    });
                });
            } else {
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
