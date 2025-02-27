const Discord = require('discord.js');
const path = require('path');

module.exports = {
	name: Discord.Events.MessageDelete,
	async execute(msg) {
		if (msg.bot || msg.system) return;
		require(path.join(global.dirname, 'modules/auto-reactor/lib/reactLib.js')).removeMessage(msg);
	},
};