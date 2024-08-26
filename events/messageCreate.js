const Discord = require('discord.js');
const path = require('path');

const dirname = global.dirname;
const stdlib = global.stdlib;

module.exports = {
	name: Discord.Events.MessageCreate,
	async execute(msg) {
		require(path.join(dirname, 'modules/word-match/lib/wordLib.js')).handleInput(msg);
	},
};