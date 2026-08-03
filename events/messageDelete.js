// Packages
const Discord = require('discord.js');
const { reactLib } = global.customLib;

module.exports = {
	name: Discord.Events.MessageDelete,
	async execute(msg) {
		await reactLib.removeMessage(msg);
	},
};