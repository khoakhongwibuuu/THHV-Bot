"use-strict";
const BotStartTime = new Date().toISOString();

const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');
const Discord = require('discord.js');

if (!process.env.TOKEN) {
	dotenv.config({ path: ".env" });
	console.info(`[${new Date().toISOString()}] [SUCCESS] root/index: Loaded login token from .env`);
}

const client = require('./assets/library/state.js').client;

(async () => {
	// Guard
	if (process.env.OWNER_ID === "") {
		console.log(`[${new Date().toISOString()}] [ERROR] root/index: You have NOT provide the Bot owner ID in auth/login.key. This BOT will be automatically turned off.`);
		process.exit(1);
	}

	if (process.env.TOKEN === "") {
		console.log(`[${new Date().toISOString()}] [ERROR] root/index: Empty token detected. Please provide a valid token.`);
		process.exit(1);
	}

	// Offline modules are now imported directly where needed
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
				console.log(`[${new Date().toISOString()}] [WARN] root/index: The command at ${filePath} is missing a required "data" or "execute" property.`);
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
		console.log(`[${new Date().toISOString()}] [WARN] root/index: Error occured. Please review.`);
		console.error(err);
	});

	process.on('uncaughtException', (err) => {
		console.log(`[${new Date().toISOString()}] [ERROR] root/index: The bot was automatically shut down by uncaught exception.`);
		console.error(err);
		setTimeout(() => process.exit(1), 1000);
	});

	process.on('unhandledRejection', (err) => {
		console.log(`[${new Date().toISOString()}] [ERROR] root/index: The bot was automatically shut down by unhandled rejection.`);
		console.error(err);
		setTimeout(() => process.exit(1), 1000);
	});

	process.on('SIGINT', async () => {
		console.log(`[${new Date().toISOString()}] [INFO] root/index: SIGINT received. Shutting down gracefully...`);
		const { disconnect } = require('./assets/library/db.js');
		await disconnect();
		client.destroy();
		process.exit(0);
	});

	process.on('SIGTERM', async () => {
		console.log(`[${new Date().toISOString()}] [INFO] root/index: SIGTERM received. Shutting down gracefully...`);
		const { disconnect } = require('./assets/library/db.js');
		await disconnect();
		client.destroy();
		process.exit(0);
	});

	try {
		client.login(process.env.TOKEN);
	} catch (error) {
		console.log(`[${new Date().toISOString()}] [ERROR] root/index: Invalid token.`);
		console.error(error);
	}
})();
