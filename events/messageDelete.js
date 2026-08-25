// Packages
const Discord = require('discord.js');
const reactLib = require('#modules/auto-reactor/lib/reactLib.js');

module.exports = {
	name: Discord.Events.MessageDelete,
	async execute(msg) {
		await reactLib.removeMessage(msg);
	},
};