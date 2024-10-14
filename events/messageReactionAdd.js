const Discord = require('discord.js');
const path = require('path');

const dirname = global.dirname;
const stdlib = global.stdlib;

module.exports = {
	name: Discord.Events.MessageReactionAdd,
	async execute(reaction, user) {
		if (user.bot || user.system) return;
	},
};