const fs = require('fs');
// Basic
const client = global.client;
const Config = global.Config;
const Lang = global.Lang;
const Utils = global.Utils;
const Base_Lang = global.Base_Lang;
const dirname = global.dirname;

const allowedList = [
    9, 9,       // General Knowledge
    17, 17, 17, // Nature Science
    18, 18, 18, // Computer Science
    19, 19, 19, // Math
    22,         // Geography
    23,         // History
    27,         // Animals
    30, 30,     // Gadgets
    31, 31      // Anime
]

const NotifyInvalid = (msg) => {
    msg.author.send({
        embed: {
            color: parseInt(Base_Lang.status.warning, 16),
            description: `:warning: ${Lang.error.parameter}`
        }
    });
}

const main_module = (msg) => {
    fetch(`https://opentdb.com/api.php?amount=1&encode=base64&category=${allowedList[Math.floor(allowedList.length * Math.random())]}`)
        .then(response => response.json())
        .then(Datablock => {
            let index = 0;
            if (atob(Datablock.results[index].type.toString()) === "multiple") {
                require(__dirname + '/multiple.js').execute(msg, Datablock, index);
            } else {
                require(__dirname + '/boolean.js').execute(msg, Datablock, index);
            }
        })
        .catch(error => {
            console.log(error);
            msg.channel.send({
                embed: {
                    color: parseInt(Base_Lang.status.warning, 16),
                    description: error.cause.code
                }
            });
        });
}

// driver module
const execute = (msg, para, cmd) => {
    if (msg.channel.type === 'text') {
        if (!msg.channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;
        if (cmd === "play") {
            if (para.length === 0) main_module(msg);
            else NotifyInvalid(msg);
        }
        else {
            let modulePath = __dirname + `/modules/${cmd}.js`
            require(modulePath).execute(msg, para);
        }
    } else {
        msg.channel.send({
            embed: {
                color: parseInt(Base_Lang.status.error, 16),
                description: `${Lang.commands.setchannel.err}`,
            }
        });
    }
}

module.exports.execute = execute;