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
    const configAPIPath = dirname + '/api/configAPI.js';
    const serverAPIPath = dirname + '/api/serverAPI.js';
    const defaultLang = require(configAPIPath).loadDefaultLanguage();
    const lang = require(configAPIPath).loadLanguage();
    const config = require(configAPIPath).loadRawData();
    const server = require(serverAPIPath).loadRawData();
    
    if (msg.channel.type === 'text')
        if (!msg.channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;
    ping('codeforces.com', msg);
    ping('opentdb.com', msg);
    ping('discord.com', msg);
}

module.exports.execute = execute;