// Special Library
const fs = require('fs');

// Basic API
const client = global.client;
let Config = global.Config;
let Lang = global.Lang;
const Utils = global.Utils;
const Base_Lang = global.Base_Lang;

const dirname = global.dirname;

const execute = (msg, para) => {
    if (msg.channel.type === 'text')
        if (!msg.channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;
    if (Config.owner.includes(msg.author.id)) {
        let opt = ["all", "lang", "config"];
        if (para[0] == undefined || para.length > 1 || !opt.includes(para[0].toLowerCase())) {
            msg.author.send({
                embed: {
                    color: parseInt(Base_Lang.status.error, 16),
                    description: `:warning: ${Lang.error.parameter}`
                }
            });
        }
        else {
            if (para[0].toLowerCase() === "config" || para[0].toLowerCase() === "all") {
                Config = JSON.parse(fs.readFileSync(dirname + '/configs/config.json', 'utf8'));
                global.Config = Config;
            }
            if (para[0].toLowerCase() === "lang" || para[0].toLowerCase() === "all") {
                Lang = JSON.parse(fs.readFileSync(dirname + `/langs/${Config.language}.json`, 'utf8'));
                global.Lang = Lang;
            }
            msg.author.send({
                embed: {
                    color: parseInt(Base_Lang.status.success, 16),
                    description: `${Lang.commands.reload.exec[para[0].toLowerCase()]}`
                }
            });
        }
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