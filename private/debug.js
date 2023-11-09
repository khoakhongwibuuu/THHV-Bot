const Discord = require('discord.js');
const fs = require('fs');

// Basic
const client = global.client;
const Config = global.Config;
const Lang = global.Lang;
const Utils = global.Utils;
const Base_Lang = global.Base_Lang;
const dirname = global.dirname;

const archiver = require('archiver');
const path = require('path');

const execute = (msg, para) => {
    if (msg.channel.type === 'text')
        if (!msg.channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;
    if (Config.owner.includes(msg.author.id)) {
        const archName = new Date().getTime();
        let output = fs.createWriteStream(path.join(dirname, 'temp', `${archName}.debug.cache`));
        let archive = archiver('zip', {
            zlib: { level: 9 }
        });

        archive.on('warning', (err) => {
            throw err;
        });

        archive.on('error', (err) => {
            throw err;
        });

        archive.pipe(output);
        archive.glob('*.log', { cwd: path.join(dirname, 'logs') });
        archive.finalize();

        output.on('close', () => {
            msg.author.send({
                files: [new Discord.MessageAttachment(dirname + `/temp/${archName}.debug.cache`, `${archName}`)]
            });
        });
    } else {
        msg.channel.send({
            embed: {
                color: parseInt(Base_Lang.status.error, 16),
                description: `:no_entry:  ${Lang.denied.owner}`,
            }
        });
    }
}

module.exports.execute = execute;