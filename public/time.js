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
    let server_time_zone = Utils.serverTimezone();
    let client_time_zone = config.timezone;
    let penalty = (client_time_zone - server_time_zone) * 60 * 60 * 1000; // difference between client timezone and server timezone
    msg.react('✅');
    msg.channel.send({
        embed: {
            color: parseInt(defaultLang.status.info, 16),
            fields: [
                {
                    name: `${lang.commands.time.exec.server}`,
                    value: `${Utils.timestampToDate(new Date().getTime(), 'full', 0)} UTC ${Utils.numberFormat(server_time_zone)}`
                },
                {
                    name: `${lang.commands.time.exec.sync}`,
                    value: `${Utils.timestampToDate(new Date().getTime(), 'full', penalty)} UTC ${Utils.numberFormat(client_time_zone)}`
                }
            ]
        }
    });
}

module.exports.execute = execute;