// Special Library
const fs = require('fs');

// Basic variables
const client = global.client;
const Utils = global.Utils;
const dirname = global.dirname;

const execute = (msg, para) => {
    const configAPIPath = dirname + '/api/configAPI.js';
    const defaultLang = require(configAPIPath).loadDefaultLanguage();
    const lang = require(configAPIPath).loadLanguage();

    const Persist = JSON.parse(fs.readFileSync(dirname + '/configs/persist.json', 'utf8'));
    const savePersist = () => { fs.writeFileSync(dirname + '/configs/persist.json', JSON.stringify(Persist)); }

    if (msg.channel.type === 'text') {
        if (!msg.channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;
        if (!msg.member.hasPermission('MANAGE_CHANNELS')) {
            msg.react('⛔');
            msg.channel.send({
                embed: {
                    color: parseInt(defaultLang.status.error, 16),
                    description: `:no_entry: ${lang.denied.moderator}`,
                }
            });
        }
        else {
            Persist.channel[msg.guild.id] = msg.channel.id;
            Persist.ready[msg.guild.id] = true;
            savePersist();
            msg.react('✅');
            msg.channel.send({
                embed: {
                    color: parseInt(defaultLang.status.success, 16),
                    description: `${lang.commands.setchannel.exec}`,
                }
            });
        }
    }
    else {
        msg.react('⚠️');
        msg.channel.send({
            embed: {
                color: parseInt(defaultLang.status.error, 16),
                description: `${lang.error.DM}`,
            }
        });
    }
}

module.exports.execute = execute;