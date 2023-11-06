const fs = require('fs');
const Discord = require('discord.js');
// Basic
const client = global.client;
const Config = global.Config;
const Lang = global.Lang;
const Utils = global.Utils;
const Base_Lang = global.Base_Lang;
const dirname = global.dirname;

const execute = (msg, para) => {
    if (Config.owner.includes(msg.author.id)) {
        const GameLib = require(dirname + '/game/lib/standardLib.js');
        if (para.length === 0) {
            msg.channel.send({
                files: [new Discord.MessageAttachment(dirname + '/configs/playerdata.json', 'database')]
            });
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
