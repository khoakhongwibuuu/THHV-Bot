"use strict";
const dotenv = require('dotenv');

if (!process.env.TOKEN) {
	dotenv.config({ path: ".env" });
	console.info(`[INFO] root/index: Loaded login token from .env`);
}

const client = require('./assets/library/state.js').client;
const { connect, disconnect } = require('./assets/library/db.js');

async function shutdown(reason = 'unknown reason', exitCode = 0) {
	console.log(`[INFO] root/index: Shutting down due to ${reason}...`);

	try {
		client.destroy();
	} catch (err) {
		console.error(`[ERROR] Discord client cleanup failed:`, err);
	}

	try {
		await disconnect();
	} catch (err) {
		console.error(`[ERROR] Database cleanup failed:`, err);
	}

	process.exit(exitCode);
}

(async () => {
	// Guard
	if (!process.env.OWNER_ID) {
		console.log(`[ERROR] root/index: Missing OWNER_ID.`);
		await shutdown('missing OWNER_ID', 1);
		return;
	}

	if (!process.env.TOKEN) {
		console.log(`[ERROR] root/index: Missing TOKEN.`);
		await shutdown('missing TOKEN', 1);
		return;
	}

	try {
		await connect();
	} catch (error) {
		console.error(`[ERROR] root/index: Failed to connect to required dependencies.`);
		console.error(error);

		await shutdown('database connection failure', 1);
		return;
	}

	// Load Commands and Events handlers
	require('./assets/instruction/discord-handler.js').loadHandlers();

	client.on('error', (err) => {
		console.log(`[WARN] root/index: Error occurred. Please review.`);
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
		shutdown('SIGINT', 0);
	});

	process.on('SIGTERM', () => {
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
