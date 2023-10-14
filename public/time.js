// Basic
const client = global.client;
const Config = global.Config;
const Lang = global.Lang;
const Utils = global.Utils;
const Base_Lang = global.Base_Lang;

const execute = (msg, para) => {
    if (msg.channel.type === 'text')
        if (!msg.channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;
    let server_time_zone = Utils.server_timezone();
    let client_time_zone = Config.timezone;
    let penalty = (client_time_zone - server_time_zone) * 60 * 60 * 1000; // difference between client timezone and server timezone
    msg.channel.send({
        embed: {
            color: parseInt(Base_Lang.status.info, 16),
            fields: [
                {
                    name: `${Lang.commands.time.exec.server}`,
                    value: `${Utils.timestampToDate(new Date().getTime(), 'full', 0)} UTC ${Utils.number_format(server_time_zone)}`
                },
                {
                    name: `${Lang.commands.time.exec.sync}`,
                    value: `${Utils.timestampToDate(new Date().getTime(), 'full', penalty)} UTC ${Utils.number_format(client_time_zone)}`
                }
            ]
        }
    });
}

module.exports.execute = execute;