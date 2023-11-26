// Basic variables
const client = global.client;
const Utils = global.Utils;
const dirname = global.dirname;

const ping = (url, msg) => {
    const start = Date.now();
    fetch(`https://${url}`)
        .then(() => {
            msg.channel.send(`${url}: \`${Date.now() - start}ms\`\n`)
        })
        .catch(err => {
            msg.channel.send(`${url}: \`${err.cause}\`\n`)
        })
}

const execute = (msg, para) => {
    if (msg.channel.type === 'text')
        if (!msg.channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;
    msg.react('✅');
    ping('codeforces.com', msg);
    ping('opentdb.com', msg);
    ping('discord.com', msg);
}

module.exports.execute = execute;