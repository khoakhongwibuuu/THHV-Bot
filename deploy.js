const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');
const Discord = require('discord.js');

// No global variables needed anymore
if (!process.env.TOKEN) {
    dotenv.config({ path: ".env" });
    console.info(`[INFO] root/deploy: Loaded config from .env`);
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
            console.log(`[WARN] root/deploy: The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

const rest = new Discord.REST().setToken(process.env.TOKEN);

(async () => {
    try {
        console.log(`[INFO] root/deploy: Started refreshing ${commands.length} application (/) commands.`);
        const data = await rest.put(Discord.Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
        console.log(`[SUCCESS] root/deploy: Successfully reloaded ${data.length} application (/) commands.`);

        // Disconnect databases gracefully
        const { disconnect } = require('./assets/library/db.js');
        await disconnect();
    } catch (error) {
        console.error(error);
        const { disconnect } = require('./assets/library/db.js');
        await disconnect();
        process.exit(1);
    }
})();