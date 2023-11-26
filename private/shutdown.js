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
        msg.author.send({
            embed: {
                color: parseInt(defaultLang.status.success, 16),
                description: `${lang.commands.shutdown.exec}`,
            }
        });
        setTimeout(() => {
            process.exit(1);
        }, 1500);
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