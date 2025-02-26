const Discord = require('discord.js');
const path = require('path');

const dirname = global.dirname;
const stdlib = global.stdlib;

module.exports = {
	name: Discord.Events.MessageDelete,
	async execute(msg) {
		if (msg.bot || msg.system) return;
		require(path.join(dirname, 'modules/auto-reactor/lib/reactLib.js')).removeMessage(msg);
	},
};