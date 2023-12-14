const fs = require('node:fs');
const path = require('node:path');
global.dirname = __dirname;
require('./assets/library/startup.js');

const Discord = require('discord.js');
const { token } = require('./configs/auth.json');

const client = new Discord.Client({
	intents: [
		Discord.GatewayIntentBits.Guilds,
		Discord.GatewayIntentBits.GuildMessages,
		Discord.GatewayIntentBits.MessageContent,
		Discord.GatewayIntentBits.GuildMembers,
		Discord.GatewayIntentBits.GuildVoiceStates,
		Discord.GatewayIntentBits.GuildMessageReactions,
		Discord.GatewayIntentBits.GuildMessageTyping,
		Discord.GatewayIntentBits.GuildPresences,
		Discord.GatewayIntentBits.GuildEmojisAndStickers,
		Discord.GatewayIntentBits.DirectMessages,
		Discord.GatewayIntentBits.DirectMessageReactions,
		Discord.GatewayIntentBits.DirectMessageTyping
	],
});
global.client = client;

const stdlib = require('./assets/library/standard.js');
global.stdlib = stdlib;

client.commands = new Discord.Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
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

const BotStartTime = new Date().toISOString();
global.BotStartTime = BotStartTime;

client.on('error', (err) => {
	console.error(err);
	('Client error occured: ' + new Date()).logE();
});

process.on('uncaughtException', (err) => {
	console.error(err);
	(`[${new Date().toISOString()}] [ERROR] Exiting due to uncaught exception: `).logE();
	process.exit(1);
});

process.on('unhandledRejection', (err) => {
	console.error(err);
});

if (token != "")
	client.login(token);
else
	console.log("Please provide a token.")