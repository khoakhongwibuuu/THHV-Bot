const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();

global.client = client;
global.dirname = __dirname;

// Create configuration files
require('./api/startup.js');

// load main api
const Utils = require('./api/utils.js');
global.Utils = Utils;

let BotStartTime = new Date();
let plainBotStartTime = Utils.timestampToDate(BotStartTime, 'short', 0);
global.BotStartTime = BotStartTime;
global.plainBotStartTime = plainBotStartTime;

const PublicCommands = ["commands", "help", "setchannel", "ping", "color", "time", "language"];
global.PublicCommands = PublicCommands;

const PrivateCommands = ["shutdown", "debug", "cache", "trust", "untrust"];
global.PrivateCommands = PrivateCommands;

const GameCommands = ["play", "score", "graph", "rule", "reset", "export"];
global.GameCommands = GameCommands;

// Load security token
const { token } = JSON.parse(fs.readFileSync('./configs/auth.json', 'utf8'));

client.on('ready', () => {
    const server = require('./api/serverAPI.js').loadRawData();
    if (server.host != "") {
        console.log(`Bot starts at: ${Utils.timestampToDate(BotStartTime, 'full', 0)}`);
        console.log(`Logging as ${client.user.tag}`);
        require('./game/lib/standardLib.js').unlock();
        require('./api/codeforces.js').fetch();
    } else {
        console.log("Since this bot only works in ONE server, please specify a guild host in server.json to use the bot.");
        setTimeout(() => {
            process.exit(1);
        }, 1500);
    }
});

client.on('message', msg => {
    const config = require('./api/configAPI.js').loadRawData();
    const server = require('./api/serverAPI.js').loadRawData();
    if (!msg.author.bot) {
        if (msg.channel.type === "dm" || msg.channel.guild.id === server.host) {
            if (msg.mentions.has(client.user)) {
                require('./public/help.js').execute(msg, "");
            }
            else if (msg.channel.id === server.suggest_channel) {
                // const Automation = JSON.parse(fs.readFileSync('./configs/auto.json', 'utf8'));
                // if (Utils.prefixChecker(Automation.commands, msg.content)) {
                //     require('./auto/react.js').execute(msg);
                // }
            }
            else {
                if (!msg.content.startsWith(config.prefix)) return;
                let commandPart = msg.content.substring(config.prefix.length);
                let parameter = Utils.istream(commandPart);
                let cmd = (commandPart.length !== 0 ? Utils.consume(parameter).toLowerCase() : '');
                if (PublicCommands.includes(cmd)) {
                    require(`./public/${cmd}.js`).execute(msg, parameter);
                }
                else if (GameCommands.includes(cmd)) {
                    require('./game/main.js').execute(msg, parameter, cmd);
                }
                else if (PrivateCommands.includes(cmd)) {
                    require(`./private/${cmd}.js`).execute(msg, parameter);
                }
                else {
                    msg.react('❌');
                    require('./api/return.js').execute(msg, parameter);
                }
                if (config.log_usage) {
                    if (msg.channel.type == "text")
                        Utils.log(`${Utils.timestampToDate(msg.createdTimestamp, 'short', 0)} ${msg.author.username} > ${msg.channel.guild.name} / ${msg.channel.name}: ${msg.content}`, plainBotStartTime);
                    else if (msg.channel.type == "dm")
                        Utils.log(`${Utils.timestampToDate(msg.createdTimestamp, 'short', 0)} ${msg.author.username} > DM : ${msg.content}`, plainBotStartTime);
                }
            }
        }
    }
});

client.on('error', (err) => {
    console.error(err);
    console.log('Client error occured: ' + new Date());
});
process.on('uncaughtException', (err) => {
    console.error(err);
    console.log("Exiting due to uncaught exception: " + new Date());
    process.exit(1);
});
process.on('unhandledRejection', (err) => {
    console.error(err);
});

if (token !== '')
    client.login(token);
else {
    console.log("Please provide a valid bot token in configs/auth.json to start.");
    setTimeout(() => {
        process.exit(1);
    }, 1500);
}

