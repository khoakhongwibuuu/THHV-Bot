const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');
const Discord = require('discord.js');

global.variable = {};
global.variable.dirname = __dirname;

global.customLib = {};
global.customLib.formLib = require('./modules/approval-form/lib/formLib.js');
global.customLib.reactLib = require('./modules/auto-reactor/lib/reactLib.js');
global.customLib.codeforcesLib = require('./modules/codeforces-utils/lib/codeforcesLib.js');
global.customLib.contestLib = require('./modules/contest/lib/contestLib.js');
global.customLib.ticketLib = require('./modules/ticket/lib/ticketLib.js');
global.customLib.gameLib = require('./modules/trivia-game/lib/gameLib.js');
global.customLib.wordLib = require('./modules/word-match/lib/wordLib.js');

if (!process.env.TOKEN) {
    dotenv.config({ path: ".env" });
    console.info("Loaded config from .env");
}

const commands = [];

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

const rest = new Discord.REST().setToken(process.env.TOKEN);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        const data = await rest.put(Discord.Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();