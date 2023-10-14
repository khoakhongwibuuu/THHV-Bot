// Basic
const client = global.client;
const Config = global.Config;
const Lang = global.Lang;
const Utils = global.Utils;
const Base_Lang = global.Base_Lang;

const execute = (msg, para) => {
    if (msg.channel.type === 'text')
        if (!msg.channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;
    let nt_hr = Config.notify_hours;
    msg.channel.send({
        embed: {
            author: {
                name: client.user.username,
                icon_url: client.user.displayAvatarURL()
            },
            title: `${client.user.username}${Lang.commands.help.title}`,
            color: parseInt(Base_Lang.status.info, 16),
            description: `${Lang.commands.help.desc[0]}${Utils.args_logging(nt_hr, true)}${Lang.commands.help.desc[1]}`,
            fields: [
                {
                    name: `${Lang.commands.help.field[0].name}`,
                    value: `${Lang.commands.help.field[0].value[0]}\`${Config.prefix}setChannel\`${Lang.commands.help.field[0].value[1]}\n`
                        + `${Lang.commands.help.field[0].value[2]}\n`
                        + `${Lang.commands.help.field[0].value[3]}`
                }
            ]
        }
    });
}

module.exports.execute = execute;