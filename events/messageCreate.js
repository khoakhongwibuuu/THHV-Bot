const Discord = require('discord.js');
const dirname = global.dirname;
const stdlib = global.stdlib;

module.exports = {
	name: Discord.Events.MessageCreate,
	async execute(msg) {
		if (msg.author.bot || msg.system) return;
		const coreLib = require(dirname + '/assets/library/core.js');
		const serverLib = require(dirname + '/assets/library/server.js');
		const suggestChannel = serverLib.load().suggest;
		if (msg.channel.id === suggestChannel) {
			const automation = [
				"suggest",
				"vote",
				"<:AC:700345520081600512> / <:WA:700345520039657613>",
				"<:AC:700345520081600512>/ <:WA:700345520039657613>",
				"<:AC:700345520081600512> /<:WA:700345520039657613>",
				"<:AC:700345520081600512>/<:WA:700345520039657613>",
				"<:AC:700345520081600512> <:WA:700345520039657613>",
				"<:AC:700345520081600512><:WA:700345520039657613>"
			]

			if (msg.content.prefixChecker(automation)) {
				msg.react(serverLib.load().emoji.yes);
				msg.react(serverLib.load().emoji.no);
			}
		}
	},
};