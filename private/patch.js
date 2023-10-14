// Basic

const client = global.client;
const Config = global.Config;
const Lang = global.Lang;
const Utils = global.Utils;
const Base_Lang = global.Base_Lang;

// Special API
let patch = JSON.parse(require('fs').readFileSync(__dirname + `/../langs/patch.json`, 'utf8'));

const execute = (msg, para) => {
    if (msg.channel.type === 'text')
        if (!msg.channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;
    let PatchContent = ""
    patch.fixes.forEach(e => {
        PatchContent += (e + '\n');
    });
    msg.channel.send({
        embed: {
            author: {
                name: client.user.username,
                icon_url: client.user.displayAvatarURL()
            },
            title: patch.title,
            description: `Patch date : <t:${patch.date}:D>`,
            fields: [
                {
                    name: `Changes`,
                    value: PatchContent
                }
            ],
            footer: {
                text: `For developers only. ${patch.link}`
            }
        }
    });
}

module.exports.execute = execute;