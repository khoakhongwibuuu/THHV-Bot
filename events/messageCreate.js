const Discord = require('discord.js');
const path = require('path');

module.exports = {
	name: Discord.Events.MessageCreate,
	async execute(msg) {
		if (msg.author.bot || msg.system || msg.tts) return;
		if (!msg.content.hasWhiteSpace() && msg.content.englishOnly())
			require(path.join(global.dirname, 'modules/word-match/lib/wordLib.js')).handleInput(msg);
		require(path.join(global.dirname, 'modules/auto-reactor/lib/reactLib.js')).initialiseInput(msg);
	},
};