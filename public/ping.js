// Basic
const client = global.client;
const Config = global.Config;
const Lang = global.Lang;
const Utils = global.Utils;
const Base_Lang = global.Base_Lang;

const execute = (msg, para) => {
    if (msg.channel.type === 'text')
        if (!msg.channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;
    let current_timestamp = new Date().getTime();
    msg.channel.send(`${Lang.commands.ping.exec}`)
        .then(sentMessgae => {
            sentMessgae.edit(`${Lang.commands.ping.exec} \`${Math.abs(current_timestamp - msg.createdTimestamp)}ms\``)
        });
}

module.exports.execute = execute;