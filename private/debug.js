// Special Library
const Discord = require('discord.js');
const fs = require('fs');
const archiver = require('archiver');
const path = require('path');

// Basic variables
const client = global.client;
const Utils = global.Utils;
const dirname = global.dirname;

const execute = (msg, para) => {
    const configAPIPath = dirname + '/api/configAPI.js';
    const defaultLang = require(configAPIPath).loadDefaultLanguage();
    const lang = require(configAPIPath).loadLanguage();
    const config = require(configAPIPath).loadRawData();

    const plainBotStartTime = global.plainBotStartTime;

    if (msg.channel.type === 'text')
        if (!msg.channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;
    if (config.owner.includes(msg.author.id)) {
        const archName = new Date().getTime();
        let output = fs.createWriteStream(path.join(dirname, 'temp', `${archName}.cache`));
        let archive = archiver('zip', {
            zlib: { level: 9 }
        });

        archive.on('warning', (err) => {
            msg.react('⚠️');
            msg.channel.send({
                embed: {
                    color: parseInt(defaultLang.status.error, 16),
                    description: `:warning: ${lang.error.other}`
                }
            });
        });

        archive.on('error', (err) => {
            msg.react('⚠️');
            msg.channel.send({
                embed: {
                    color: parseInt(defaultLang.status.error, 16),
                    description: `:warning: ${lang.error.other}`
                }
            });
        });

        archive.pipe(output);
        if (para[0] === "all" && para.length === 1)
            archive.glob('*.log', { cwd: path.join(dirname, 'logs') });
        else
            archive.glob(`${plainBotStartTime}.log`, { cwd: path.join(dirname, 'logs') });
        archive.finalize();
        output.on('close', () => {
            msg.react('✅');
            msg.author.send({
                files: [new Discord.MessageAttachment(dirname + `/temp/${archName}.cache`, `${archName}${(para[0] === "all" ? "-all" : "")}`)]
            }).then(sentmsg => setTimeout(() => sentmsg.delete(), 5000))
        });
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