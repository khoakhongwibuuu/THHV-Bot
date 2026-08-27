const fs = require('node:fs');
const path = require('node:path');
const Discord = require('discord.js');
const { client } = require('../library/state.js');

module.exports.loadHandlers = () => {
    // 1. Load Commands
    client.commands = new Discord.Collection();
    const foldersPath = path.join(__dirname, '../../commands');

    if (fs.existsSync(foldersPath)) {
        const commandFolders = fs.readdirSync(foldersPath);
        for (const folder of commandFolders) {
            const commandsPath = path.join(foldersPath, folder);
            if (fs.statSync(commandsPath).isDirectory()) {
                const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
                for (const file of commandFiles) {
                    const filePath = path.join(commandsPath, file);
                    const command = require(filePath);
                    if ('data' in command && 'execute' in command) {
                        client.commands.set(command.data.name, command);
                        console.log(`[INFO] Client: Loaded ${filePath} successfully.`);
                    } else {
                        console.log(`[Error] Client: The command at ${filePath} is missing a required "data" or "execute" property.`);
                    }
                }
            }
        }
    }

    // 2. Load Events
    const eventsPath = path.join(__dirname, '../../events');
    if (fs.existsSync(eventsPath)) {
        const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
        for (const file of eventFiles) {
            const filePath = path.join(eventsPath, file);
            const event = require(filePath);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args));
            } else {
                client.on(event.name, (...args) => event.execute(...args));
            }
        }
    }
};
