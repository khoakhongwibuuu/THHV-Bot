const Discord = require('discord.js');
const dotenv = require('dotenv');

if (!process.env.TOKEN) {
	dotenv.config({ path: ".env" });
    console.info(`[INFO] root/undeploy: Loaded config from .env`);
}

new Discord.REST()
	.setToken(process.env.TOKEN).put(Discord.Routes.applicationCommands(process.env.CLIENT_ID), { body: [] })
	.then(() => console.log(`[SUCCESS] root/undeploy: Successfully deleted all application commands.`))
	.catch(console.error);