// Packages
const Discord = require('discord.js');
const { wordLib, reactLib } = global.customLib;

module.exports = {
	name: Discord.Events.MessageCreate,
	async execute(msg) {
		if (msg.author.bot || msg.system || msg.tts) return;
		if (!msg.content.hasWhiteSpace() && msg.content.englishOnly())
			wordLib.handleInput(msg);
		reactLib.initialiseInput(msg);
	},
};