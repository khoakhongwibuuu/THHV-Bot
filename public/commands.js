// Basic variables
const client = global.client;
const Utils = global.Utils;
const dirname = global.dirname;

const execute = (msg, para) => {
    const configAPIPath = dirname + '/api/configAPI.js';
    const defaultLang = require(configAPIPath).loadDefaultLanguage();
    const lang = require(configAPIPath).loadLanguage();
    const config = require(configAPIPath).loadRawData();
    const PublicCommands = global.PublicCommands

    let v = '';
    if (msg.channel.type === 'text')
        if (!msg.channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;
    PublicCommands.forEach((e, i, a) => {
        if (i > 1 && i < PublicCommands.length) {
            v += ('* \`' + config.prefix + e + '\` ' + lang.commands[e].desc + '\n');
        }
    });

    msg.channel.send({
        embed: {
            author: {
                name: client.user.username,
                icon_url: client.user.displayAvatarURL()
            },
            title: `${lang.commands.commands.exec}`,
            color: parseInt(defaultLang.status.info, 16),
            description: `${v}`
        }
    });
}

module.exports.execute = execute;