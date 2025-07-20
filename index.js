"use-strict";
const BotStartTime = new Date().toISOString();

const fs = require('node:fs');
const fsPromises = require('node:fs').promises;
const path = require('node:path');
const dotenv = require('dotenv');
const Discord = require('discord.js');

const tokenPath = path.join(__dirname, 'auth');
if (!fs.existsSync(tokenPath)) {
	fs.mkdirSync(tokenPath, { recursive: true });
}

if (!fs.existsSync(path.join(tokenPath, 'login.env'))) {
	fs.writeFileSync(path.join(tokenPath, 'login.env'), "TOKEN=\nCLIENT_ID=\nOWNER_ID=", 'utf8');
	console.log("Login file created!");
	process.exit(0);
}

if (!process.env.TOKEN) {
	dotenv.config({ path: "./auth/login.env" });
	console.info("Loaded config from login.env");
}

global.variable = {};
global.variable.BotStartTime = BotStartTime;
global.variable.dirname = __dirname;

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
	partials: [
		Discord.Partials.Message,
		Discord.Partials.Reaction,
		Discord.Partials.User
	]
});

global.variable.client = client;
global.customLib = {};
global.customLib.memory = require('./assets/api/memory.api.js');
global.customLib.stdlib = require('./assets/library/standard.js');
global.customLib.discordAPI = require('./assets/api/discord.api.js');

async function loadModules() {
	const modulesPath = path.join(__dirname, "modules");
	const files = await fsPromises.readdir(modulesPath, { withFileTypes: true });

	for (const file of files) {
		if (file.isDirectory()) {
			const loaderPath = path.join(modulesPath, file.name, "offline-loader.js");
			if (fs.existsSync(loaderPath)) {
				try {
					await fsPromises.access(loaderPath);
					console.log(`[${new Date().toISOString()}] [INFO] Client: loading ${file.name} module!`);
					const loadTime = Date.now();
					require(loaderPath);
					const finishTime = Date.now();
					console.log(`[${new Date().toISOString()}] [SUCCESS] Client: loaded ${file.name} module in ${finishTime - loadTime}ms!`);
				} catch (err) {
					console.error(`[${new Date().toISOString()}] [ERROR] Error loading module ${file.name}:`, err);
					process.exit(1);
				}
			}
		}
	}
}

(async () => {
	await loadModules();

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
		console.log(`[${new Date().toISOString()}] [WARN] Error occured. Please review.`);
		console.error(err);
	});

	process.on('uncaughtException', (err) => {
		console.log(`[${new Date().toISOString()}] [ERROR] The bot was automatically shut down by uncaught exception.`);
		console.error(err);
		setTimeout(() => process.exit(1), 1000);
	});

	process.on('unhandledRejection', (err) => {
		console.log(`[${new Date().toISOString()}] [ERROR] The bot was automatically shut down by unhandled rejection.`);
		console.error(err);
		setTimeout(() => process.exit(1), 1000);
	});

	if (process.env.TOKEN !== "")
		try {
			client.login(process.env.TOKEN);
		} catch (error) {
			console.error(error);
		}
	else
		console.log("Please provide a token.");
})();
