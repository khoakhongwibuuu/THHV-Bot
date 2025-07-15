// Packages
const Discord = require('discord.js');
const { reactLib } = global.customLib;

module.exports = {
	name: Discord.Events.MessageDelete,
	async execute(msg) {
		if (msg.bot || msg.system) return;
		reactLib.removeMessage(msg);
	},
};