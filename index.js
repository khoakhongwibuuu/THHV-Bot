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
const { disconnect } = require('./assets/library/db.js');

async function shutdown(reason = 'unknown reason', exitCode = 0) {
	console.log(`[INFO] root/index: Shutting down due to ${reason}...`);
	try {
		await disconnect();
		client.destroy();
	} catch (err) {
		console.error(`[ERROR] Cleanup failed:`, err);
	} finally {
		process.exit(exitCode);
	}
}

(async () => {
	// Guard
	if (process.env.OWNER_ID === "") {
		console.log(`[ERROR] root/index: You have NOT provide the Bot owner ID in auth/login.key. This BOT will be automatically turned off.`);
		await shutdown('missing OWNER_ID', 1);
	}

	if (process.env.TOKEN === "") {
		console.log(`[ERROR] root/index: Empty token detected. Please provide a valid token.`);
		await shutdown('missing TOKEN', 1);
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
		shutdown('uncaughtException', 1);
	});

	process.on('unhandledRejection', (err) => {
		console.log(`[ERROR] root/index: The bot was automatically shut down by unhandled rejection.`);
		console.error(err);
		shutdown('unhandledRejection', 1);
	});

	process.on('SIGINT', () => {
		console.log(`[INFO] root/index: SIGINT received. Shutting down gracefully...`);
		shutdown('SIGINT', 0);
	});

	process.on('SIGTERM', () => {
		console.log(`[INFO] root/index: SIGTERM received. Shutting down gracefully...`);
		shutdown('SIGTERM', 0);
	});

	try {
		console.log(`[INFO] Client: Logging in...`);
		await client.login(process.env.TOKEN);
	} catch (error) {
		console.log(`[ERROR] root/index: Invalid token.`);
		console.error(error);
		await shutdown('login error', 1);
	}
})();
