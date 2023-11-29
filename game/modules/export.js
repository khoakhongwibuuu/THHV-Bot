// Special library
const Discord = require('discord.js');

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
        if (para.length === 0) {
            msg.react('✅');
            msg.author.send({
                files: [new Discord.MessageAttachment(dirname + '/configs/playerData.json', 'database')]
            }).then(thisMessage => setTimeout(() => thisMessage.delete(), 10000));
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
