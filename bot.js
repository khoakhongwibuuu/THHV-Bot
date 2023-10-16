const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();

// Global client instance
global.client = client;

// Global __dirname
global.dirname = __dirname;

// Creating config directory
if (!fs.existsSync(__dirname + '/configs')) {
    fs.mkdirSync(__dirname + '/configs', { recursive: true });
}

// Creating default configuration files
if (!fs.existsSync(__dirname + '/configs/config.json')) {
    fs.writeFileSync(__dirname + '/configs/config.json', JSON.stringify({
        owner: [""],
        log_usage: false,
        notify_hours: [6, 24],
        prefix: "--",
        language: "en-us",
        timezone: 0
    }, null, 4));
}

if (!fs.existsSync(__dirname + '/configs/persist.json')) {
    fs.writeFileSync(__dirname + '/configs/persist.json', JSON.stringify({
        ready: {},
        channel: {}
    }, null, 4));
}

if (!fs.existsSync(__dirname + '/configs/server.json')) {
    fs.writeFileSync(__dirname + '/configs/server.json', JSON.stringify({
        notify_role: "",
        log_channel: "",
        suggest_channel: ""
    }, null, 4));
}

if (!fs.existsSync(__dirname + '/configs/auth.json')) {
    fs.writeFileSync(__dirname + '/configs/auth.json', JSON.stringify({
        token: "",
    }, null, 4));
}

if (!fs.existsSync(__dirname + '/configs/playerdata.json')) {
    fs.writeFileSync(__dirname + '/configs/playerdata.json', JSON.stringify({
    }, null, 4));
}

// Updating old config files
require(__dirname + '/api/editor').update();

// Load security token
const { token } = JSON.parse(fs.readFileSync(__dirname + '/configs/auth.json', 'utf8'));
global.token = token;

// Load configuration
let Config = JSON.parse(fs.readFileSync(__dirname + '/configs/config.json', 'utf8'));
global.Config = Config;

let server = JSON.parse(fs.readFileSync(__dirname + '/configs/server.json', 'utf8'));
global.server = server;

const Persist = JSON.parse(fs.readFileSync(__dirname + '/configs/persist.json', 'utf8'));
global.Persist = Persist;

const savePersist = () => { fs.writeFileSync(__dirname + '/configs/persist.json', JSON.stringify(Persist, null, 4)); }
global.savePersist = savePersist;

// Load Basic language
let Base_Lang = JSON.parse(fs.readFileSync(__dirname + `/langs/default.json`, 'utf8'));
global.Base_Lang = Base_Lang;

// Load chosen language
let Lang = JSON.parse(fs.readFileSync(__dirname + `/langs/${Config.language}.json`, 'utf8'));
global.Lang = Lang;

// load api
const Utils = require(__dirname + '/api/utils.js');
global.Utils = Utils;

let BotStartTime = null;
global.BotStartTime = BotStartTime;

const PublicCommands = ["commands", "help", "setchannel", "ping", "github", "platform", "color", "time", "language"];
global.PublicCommands = PublicCommands;

const PrivateCommands = ["shutdown", "api", "reload", "pwd", "setcfg", "patch"];
global.PrivateCommands = PrivateCommands;

const GameCommands = ["play", "score", "rank", "rule"];
global.GameCommands = GameCommands;

const AutomationCommands = [
    "suggest", "vote",
    "<:AC:700345520081600512> / <:WA:700345520039657613>",
    "<:AC:700345520081600512>/ <:WA:700345520039657613>",
    "<:AC:700345520081600512> /<:WA:700345520039657613>",
    "<:AC:700345520081600512>/<:WA:700345520039657613>",
    "<:AC:700345520081600512> <:WA:700345520039657613>",
    "<:AC:700345520081600512><:WA:700345520039657613>"
];

global.AutomationCommands = AutomationCommands;

client.on('ready', () => {
    BotStartTime = new Date();
    console.log(`Bot starts at: ${Utils.timestampToDate(BotStartTime, 'full', 0)}`);
    console.log(`Logging as ${client.user.tag}`);
    require(__dirname + '/api/codeforces.js').fetch();
});

client.on('message', msg => {
    if (!msg.author.bot) {
        if (msg.mentions.has(client.user)) {
            require(__dirname + "/public/help.js").execute(msg, "");
        }
        else if (msg.channel.id == server.suggest_channel) {
            console.log("eccc");
            if (Utils.prefixChecker(AutomationCommands, msg.content)) {
                require(__dirname + '/auto/react.js').execute(msg);
            }
        } else {
            if (!msg.content.startsWith(Config.prefix)) return;
            let commandPart = msg.content.substring(Config.prefix.length);
            let parameter = Utils.istream(commandPart);
            let cmd = (commandPart.length !== 0 ? Utils.consume(parameter).toLowerCase() : '');
            if (PublicCommands.includes(cmd)) {
                require(__dirname + `/public/${cmd}.js`).execute(msg, parameter);
            }
            else if (GameCommands.includes(cmd)) {
                require(__dirname + `/game/main.js`).execute(msg, parameter,cmd);
            }
            else if (PrivateCommands.includes(cmd)) {
                require(__dirname + `/private/${cmd}.js`).execute(msg, parameter);
                if (Config.owner.includes(msg.author.id) && msg.channel.type === 'text')
                    msg.delete();
            } else {
                require(__dirname + '/api/return.js').execute(msg, parameter);
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

