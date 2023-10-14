// Basic 
const client = global.client;
const Config = global.Config;
const Lang = global.Lang;
const Utils = global.Utils;
const Base_Lang = global.Base_Lang;

const execute = (msg, para) => {
    if (msg.channel.type === 'text')
        if (!msg.channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;
    msg.author.send({
        embed: {
            color: parseInt(Base_Lang.status.info, 16),
            fields: [
                {
                    name: `Codeforces API`,
                    value: `:link: ${Base_Lang.links.codeforces_api}`
                }
            ]
        }
    });
}

module.exports.execute = execute;