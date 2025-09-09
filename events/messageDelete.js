// Packages
const Discord = require('discord.js');
const { reactLib } = global.customLib;

module.exports = {
	name: Discord.Events.MessageDelete,
	async execute(msg) {
		if (msg.author.bot || msg.system || msg.tts) return;
		await reactLib.removeMessage(msg);
	},
};