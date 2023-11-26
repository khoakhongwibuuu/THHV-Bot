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
    let notifyHours = config.notify_hours;
    msg.channel.send({
        embed: {
            author: {
                name: client.user.username,
                icon_url: client.user.displayAvatarURL()
            },
            title: `${client.user.username}${lang.commands.help.title}`,
            color: parseInt(defaultLang.status.info, 16),
            description: `${lang.commands.help.desc[0]}${Utils.args_logging(notifyHours, true)}${lang.commands.help.desc[1]}`,
            fields: [
                {
                    name: `${lang.commands.help.field[0].name}`,
                    value: `${lang.commands.help.field[0].value[0]}\`${config.prefix}setChannel\`${lang.commands.help.field[0].value[1]}\n`
                        + `${lang.commands.help.field[0].value[2]}\n`
                        + `${lang.commands.help.field[0].value[3]}`
                }
            ]
        }
    });
}

module.exports.execute = execute;