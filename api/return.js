// Basic variables
const client = global.client;
const Utils = global.Utils;
const dirname = global.dirname;

const execute = (msg, para) => {
    const configAPIPath = dirname + '/api/configAPI.js';
    const defaultLang = require(configAPIPath).loadDefaultLanguage();
    const lang = require(configAPIPath).loadLanguage();

    if (msg.channel.type === 'text')
        if (!msg.channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;
    msg.channel.send({
        embed: {
            color: parseInt(defaultLang.status.error, 16),
            description: `:question:${lang.error.unknown}`,
        }
    });
}

module.exports.execute = execute;