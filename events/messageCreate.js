// Packages
const Discord = require('discord.js');
const wordLib = require('#modules/word-match/lib/wordLib.js');
const reactLib = require('#modules/auto-reactor/lib/reactLib.js');

module.exports = {
	name: Discord.Events.MessageCreate,
	async execute(msg) {
		if (msg.author.bot || msg.system || msg.tts) return;
		await reactLib.initialiseInput(msg);

		if (!msg.content.hasWhiteSpace() && msg.content.englishOnly())
			await wordLib.handleInput(msg);
	},
};