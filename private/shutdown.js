// Basic 
const client = global.client;
const Config = global.Config;
const Lang = global.Lang;
const Utils = global.Utils;
const Base_Lang = global.Base_Lang;

const execute = (msg, para) => {
    if (msg.channel.type === 'text')
        if (!msg.channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;
    if (Config.owner.includes(msg.author.id)) {
        msg.author.send({
            embed: {
                color: parseInt(Base_Lang.status.success, 16),
                description: `${Lang.commands.shutdown.exec}`,
            }
        });
        setTimeout(() => {
            process.exit(1);
        }, 1500);
    } else {
        msg.channel.send({
            embed: {
                color: parseInt(Base_Lang.status.error, 16),
                description: `:no_entry:  ${Lang.denied.owner}`,
            }
        });
    }
}

module.exports.execute = execute;