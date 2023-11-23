// Basic
const client = global.client;
const Config = global.Config;
const Lang = global.Lang;
const Utils = global.Utils;
const Base_Lang = global.Base_Lang;

// Special API
const dirname = global.dirname
const editorAPI = require(dirname + '/api/editor.js');

const allowed_para = ['language', 'view'];

const NotifyInvalid = (msg) => {
    msg.author.send({
        embed: {
            color: parseInt(Base_Lang.status.warning, 16),
            description: `:warning: ${Lang.error.parameter}`
        }
    });
}

const viewCfg = (msg) => {
    let content = '';
    for (const [key, value] of Object.entries(Config))
        if (allowed_para.includes(key))
            content += `${key}: ${value}\n`;
    msg.author.send({
        embed: {
            description: `\`\`\`json\n${content}\`\`\``
        }
    });
}

const NotifySuccess = (msg) => {
    msg.author.send({
        embed: {
            color: parseInt(Base_Lang.status.success, 16),
            description: `${Lang.commands.setcfg.exec}`
        }
    });
}

const execute = (msg, para) => {
    // Bugs found but I dont want to fix, so I disabled this module instead :D
    return;
    if (msg.channel.type === 'text')
        if (!msg.channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;
    if (Config.owner.includes(msg.author.id)) {
        if (para.length === 0 || !allowed_para.includes(para[0])) {
            NotifyInvalid(msg);
            return;
        }
        para[0] = para[0].toLowerCase();
        if (para[0] === "timezone") {
            if (Number.isInteger(parseInt(para[1]))) {
                editorAPI.Config_editor("timezone", parseInt(para[1]), true);
                NotifySuccess(msg);
            }
            else {
                NotifyInvalid(msg);
                return;
            }
        } else if (para[0] === "language") {
            if (["en-us", "vi-vn"].includes(para[1])) {
                editorAPI.Config_editor("language", para[1], true);
                require(dirname + "/private/reload.js").execute(msg, ["all"]);
            }
            else {
                NotifyInvalid(msg);
                return;
            }
        } else if (para[0] === "prefix") {
            if (para[1].length > 0) {
                editorAPI.Config_editor("prefix", para[1], true);
                require(dirname + "/private/reload.js").execute(msg, ["config"]);
            } else {
                NotifyInvalid(msg);
                return;
            }
        }
        else if (para[0] === "view") {
            viewCfg(msg);
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