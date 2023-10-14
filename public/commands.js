// Basic
const client = global.client;
const Config = global.Config;
const Lang = global.Lang;
const Utils = global.Utils;
const Base_Lang = global.Base_Lang;

// Special API
const PublicCommands = global.PublicCommands

const execute = (msg, para) => {
    let v = '';
    if (msg.channel.type === 'text')
        if (!msg.channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;
    PublicCommands.forEach((e, i, a) => {
        if (i > 1 && i < PublicCommands.length) {
            v += ('* \`' + Config.prefix + e + '\` ' + Lang.commands[e].desc + '\n');
        }
    });

    msg.channel.send({
        embed: {
            author: {
                name: client.user.username,
                icon_url: client.user.displayAvatarURL()
            },
            title: `${Lang.commands.commands.exec}`,
            color: parseInt(Base_Lang.status.info, 16),
            description: `${v}`
        }
    });
}

module.exports.execute = execute;