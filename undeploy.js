const Discord = require('discord.js');
const dotenv = require('dotenv');

if (!process.env.TOKEN) {
	// load config from login.env
	dotenv.config({ path: "./auth/login.env" });
	console.info("Loaded config from login.env");
}

new Discord.REST()
	.setToken(process.env.TOKEN).put(Discord.Routes.applicationCommands(process.env.CLIENT_ID), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);