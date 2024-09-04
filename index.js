const BotStartTime = new Date().toISOString();
global.BotStartTime = BotStartTime;

const fs = require('node:fs');
const path = require('node:path');

global.dirname = __dirname;
const dirname = global.dirname;
const dotenv = require('dotenv');

if (!process.env.TOKENS) {
	// load config from login.env
	dotenv.config({ path: "./auth/login.env" });
}

if (!fs.existsSync(dirname + '/logs')) {
	fs.mkdirSync(dirname + '/logs', { recursive: true });
}

const Discord = require('discord.js');

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

global.discordAPI = require('./assets/api/discord.api.js');
global.stdlib = require('./assets/library/standard.js');

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

client.on('error', (err) => {
	(`[${new Date().toISOString()}] [WARNING] Error occured. Please review.`).logOffline();
	console.error(err);
});

process.on('uncaughtException', (err) => {
	(`[${new Date().toISOString()}] [ERROR] The bot was automatically shut down by uncaught exception.`).logOffline();
	console.error(err);
	setTimeout(() => process.exit(1), 1000);
});

process.on('unhandledRejection', (err) => {
	(`[${new Date().toISOString()}] [WARN] The bot was automatically shut down by unhandled rejection.`).logOffline();
	console.error(err);
	setTimeout(() => process.exit(1), 1000);
});

if (process.env.TOKEN != "")
	client.login(process.env.TOKEN);
else
	console.log("Please provide a token.")