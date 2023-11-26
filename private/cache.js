// Special Library
const fs = require('fs');
const path = require('path');

// Basic variables
const client = global.client;
const Utils = global.Utils;
const dirname = global.dirname;

const removeTree = (directory) => {
    if (fs.existsSync(directory)) {
        fs.readdirSync(directory).forEach(file => {
            const currentPath = path.join(directory, file);
            if (fs.lstatSync(currentPath).isDirectory()) {
                removeTree(currentPath);
                fs.rmdirSync(currentPath);
            } else {
                fs.unlinkSync(currentPath);
            }
        });
    }
};

const execute = (msg, para) => {
    const configAPIPath = dirname + '/api/configAPI.js';
    const defaultLang = require(configAPIPath).loadDefaultLanguage();
    const lang = require(configAPIPath).loadLanguage();
    const config = require(configAPIPath).loadRawData();

    if (msg.channel.type === 'text')
        if (!msg.channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;
    if (config.owner.includes(msg.author.id)) {
        msg.author.send({
            embed: {
                color: parseInt(defaultLang.status.warning, 16),
                description: `:warning: This action will clear all cached files. Do you want to continue?`
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
                        if (config.owner.includes(user.id)) {
                            voters.add(user.id);
                            if (reaction._emoji.name === '✅') {
                                removeTree('temp');
                                msg.author.send({
                                    embed: {
                                        color: parseInt(defaultLang.status.success, 16),
                                        description: `Task finished successfully.`
                                    }
                                });
                            } else {
                                msg.author.send({
                                    embed: {
                                        color: parseInt(defaultLang.status.info, 16),
                                        description: `The request was cancelled by the user.`
                                    }
                                });
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
                        });
                    sentMessage.delete();
                });
            });
    } else {
        msg.channel.send({
            embed: {
                color: parseInt(defaultLang.status.error, 16),
                description: `:no_entry:  ${lang.denied.owner}`,
            }
        });
    }
}

module.exports.execute = execute;