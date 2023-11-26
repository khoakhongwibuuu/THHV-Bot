// Basic variables
const client = global.client;
const Utils = global.Utils;
const dirname = global.dirname;

const execute = (msg, para) => {
    const configAPIPath = dirname + '/api/configAPI.js';
    const defaultLang = require(configAPIPath).loadDefaultLanguage();
    const lang = require(configAPIPath).loadLanguage();
    const config = require(configAPIPath).loadRawData();

    if (msg.channel.type === 'text')
        if (!msg.channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;
    if (config.owner.includes(msg.author.id)) {
        if (para.length === 1) {
            const userID = Utils.objectToID(para[0]);
            if (Utils.isNum(userID)) {
                if (!config.owner.includes(userID)) {
                    msg.react('⚠️');
                    msg.channel.send({
                        embed: {
                            color: parseInt(defaultLang.status.warning, 16),
                            description: `:warning: <@${userID}> ${lang.commands.untrust.already}`
                        }
                    });
                }
                else {
                    if (msg.author.id === userID) {
                        msg.react('⚠️');
                        msg.channel.send({
                            embed: {
                                color: parseInt(defaultLang.status.warning, 16),
                                description: `:warning: ${lang.commands.untrust.self}`
                            }
                        });
                    }
                    else {
                        require(configAPIPath).untrust(userID);
                        msg.react('✅');
                        msg.channel.send({
                            embed: {
                                color: parseInt(defaultLang.status.success, 16),
                                description: `<@${userID}> ${lang.commands.untrust.exec}`
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