// Basic variables
const client = global.client;
const Utils = global.Utils;
const dirname = global.dirname;

const execute = (msg, para) => {
    const configAPIPath = dirname + '/api/configAPI.js';
    const defaultLang = require(configAPIPath).loadDefaultLanguage();
    const lang = require(configAPIPath).loadLanguage();
    const config = require(configAPIPath).loadRawData();

    if (config.owner.includes(msg.author.id)) {
        const GameLib = require(dirname + '/game/lib/standardLib.js');
        if (para.length === 0) {
            msg.react('⚠️');
            msg.channel.send({
                embed: {
                    color: parseInt(defaultLang.status.warning, 16),
                    description: `:warning: A User ID is needed for this command in order to prevent users from accidentally reseting their data.`
                }
            });
        }
        else if (para.length === 1) {
            if (para[0] === "all") {
                msg.channel.send({
                    embed: {
                        color: parseInt(defaultLang.status.warning, 16),
                        description: `:warning: This is a destructive action, do you want to continue?`
                    }
                })
                    .then(sentMessage => {
                        sentMessage.react('✅')
                            .then(() => sentMessage.react('🚫'));
                        const filter = (reaction, user) => ['✅', '🚫'].includes(reaction.emoji.name);
                        const collector = sentMessage.createReactionCollector(filter, { time: 5000 });
                        let voters = new Set();
                        voters.add(client.user.id);
                        collector.on('collect', (reaction, user) => {
                            if (!voters.has(user.id) && ['✅', '🚫'].includes(reaction._emoji.name)) {
                                if (config.owner.includes(user.id)) {
                                    voters.add(user.id);
                                    if (reaction._emoji.name === '✅') {
                                        GameLib.allDataDelete();
                                        msg.author.send({
                                            embed: {
                                                color: parseInt(defaultLang.status.success, 16),
                                                description: `Task finished successfully.`
                                            }
                                        }).then(thisMessage => setTimeout(() => thisMessage.delete(), 10000));
                                    }
                                    else {
                                        msg.author.send({
                                            embed: {
                                                color: parseInt(defaultLang.status.info, 16),
                                                description: `The request was cancelled by the user.`
                                            }
                                        }).then(thisMessage => setTimeout(() => thisMessage.delete(), 10000));
                                    }
                                }
                            }
                        });
                        collector.on('end', collected => {
                            if (voters.size === 1)
                                msg.author.send({
                                    embed: {
                                        color: parseInt(defaultLang.status.info, 16),
                                        description: `The request was cancelled automatically.`
                                    }
                                }).then(thisMessage => setTimeout(() => thisMessage.delete(), 10000));
                            sentMessage.delete();
                            msg.delete();
                        });
                    });
            }
            else {
                let userID = Utils.objectToID(para[0]);
                let loadedData = GameLib.readScore(userID);
                if (loadedData !== "Unknown") {
                    GameLib.resetScore(userID);
                    msg.channel.send({
                        embed: {
                            color: parseInt(defaultLang.status.info, 16),
                            description: `<@${userID}>'s data has been deleted.`
                        }
                    }).then(sentMessage => setTimeout(() => { sentMessage.delete(); msg.delete(); }, 5000));
                }
                else {
                    msg.react('⚠️');
                    msg.channel.send({
                        embed: {
                            color: parseInt(defaultLang.status.warning, 16),
                            description: (Utils.isNum(userID)) ? `:warning: ${(userID === msg.author.id) ? "Your" : `<@${userID}>'s`} data is not found in the database.` : "Please use User ID or Mentions instead."
                        }
                    });
                }
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
        msg.react('⛔');
        msg.channel.send({
            embed: {
                color: parseInt(defaultLang.status.error, 16),
                description: `:no_entry: ${lang.denied.owner}`,
            }
        });
    }
}

module.exports.execute = execute;
