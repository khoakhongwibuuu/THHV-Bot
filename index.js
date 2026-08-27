"use-strict";
const BotStartTime = new Date().toISOString();

const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');
const Discord = require('discord.js');

if (!process.env.TOKEN) {
	dotenv.config({ path: ".env" });
	console.info(`[INFO] root/index: Loaded login token from .env`);
}

const client = require('./assets/library/state.js').client;

(async () => {
	// Guard
	if (process.env.OWNER_ID === "") {
		console.log(`[ERROR] root/index: You have NOT provide the Bot owner ID in auth/login.key. This BOT will be automatically turned off.`);
		process.exit(1);
	}

	if (process.env.TOKEN === "") {
		console.log(`[ERROR] root/index: Empty token detected. Please provide a valid token.`);
		process.exit(1);
	}

	// Load Commands and Events handlers
	require('./assets/instruction/discord-handler.js').loadHandlers();

	client.on('error', (err) => {
		console.log(`[WARN] root/index: Error occured. Please review.`);
		console.error(err);
	});

	process.on('uncaughtException', (err) => {
		console.log(`[ERROR] root/index: The bot was automatically shut down by uncaught exception.`);
		console.error(err);
		setTimeout(() => process.exit(1), 1000);
	});

	process.on('unhandledRejection', (err) => {
		console.log(`[ERROR] root/index: The bot was automatically shut down by unhandled rejection.`);
		console.error(err);
		setTimeout(() => process.exit(1), 1000);
	});

	process.on('SIGINT', async () => {
		console.log(`[INFO] root/index: SIGINT received. Shutting down gracefully...`);
		const { disconnect } = require('./assets/library/db.js');
		await disconnect();
		client.destroy();
		process.exit(0);
	});

	process.on('SIGTERM', async () => {
		console.log(`[INFO] root/index: SIGTERM received. Shutting down gracefully...`);
		const { disconnect } = require('./assets/library/db.js');
		await disconnect();
		client.destroy();
		process.exit(0);
	});

	try {
		client.login(process.env.TOKEN);
	} catch (error) {
		console.log(`[ERROR] root/index: Invalid token.`);
		console.error(error);
	}
})();
