const client = global.client;
const Lang = global.Lang;
const Base_Lang = global.Base_Lang;
const execute = (msg, para) => {
    if (msg.channel.type === 'text')
        if (!msg.channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;
    msg.channel.send({
        embed: {
            color: parseInt(Base_Lang.status.error, 16),
            description: `:question:${Lang.error.unknown}`,
        }
    });
}

module.exports.execute = execute;