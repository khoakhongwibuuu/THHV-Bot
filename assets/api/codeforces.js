// Special library
const fs = require('fs');
const { EmbedBuilder } = require('discord.js');
// import fetch from 'node-fetch';

// Basic variables
const client = global.client;
const stdlib = global.stdlib;
const dirname = global.dirname;

const coreLib = require(dirname + '/assets/library/core.js');
const core = coreLib.load();

// Special API
const Persist = JSON.parse(fs.readFileSync(dirname + '/configs/persist.json', 'utf8'));
const savePersist = () => { fs.writeFileSync(dirname + '/configs/persist.json', JSON.stringify(Persist)); }

const notify = (res, id, name, url, startTime, type) => {
	const notifyable = client.guilds.cache.filter(guild => {
		if (!Persist[res]) Persist[res] = {};
		if (!Persist[res][guild.id]) Persist[res][guild.id] = {};
		if (!Persist[res][guild.id][type]) Persist[res][guild.id][type] = [];
		return Persist[res][guild.id][type].indexOf(id) < 0;
	});
	notifyable.forEach(guild => {
		if (!Persist.ready[guild.id]) return;
		const channelID = Persist.channel[guild.id];
		const channel = guild.channels.cache.get(channelID);
		const embed = new EmbedBuilder()
			.setAuthor({
				name: client.user.username,
				iconURL: client.user.displayAvatarURL()
			})
			.setTitle(name)
			.setURL(url)
			.setDescription(`Contest starts <t:${startTime / 1000}:F>`)
			.setFooter({
				text: `${res} | This message was sent at`
			})
			.setTimestamp();
		channel.send({
			content: (core.notificationRole === "") ? "Upcoming contest announced!" : `<@&${core.notificationRole}>, upcoming contest announced!`,
			embeds: [embed]
		}).then(thisMsg => thisMsg.react(serverLib.load().emoji.yes));
		Persist[res][guild.id][type].push(id);
		savePersist();
	});
}

let list = [];
const doNotify = (res) => {
	list.forEach(obj => {
		const startTime = new Date(parseInt(obj.startTimeSeconds) * 1000);
		const rtime = -obj.relativeTimeSeconds;
		coreLib.load().notificationHours.forEach(time => {
			if (rtime <= time * 3600) {
				notify(res, obj.id, obj.name, `https://codeforces.com/contests/${obj.id}`, startTime, time);
			}
		})
	});
}

let Tolerance = 5;
const clock = () => {
	fetch('http://codeforces.com/api/contest.list')
		.then(data => data.json())
		.then(res => {
			if (res.status === 'OK') {
				list = res.result.filter(obj => obj.phase === 'BEFORE');
				Tolerance = 5;
				doNotify('codeforces.com');
			}
		})
		.catch(err => {
			console.log(err);
		});
	setTimeout(clock, 1000 * 60 - new Date().getMilliseconds());
}

const exec = () => {
	setTimeout(clock, 1000 * (60 - new Date().getSeconds()));
}

module.exports.exec = exec;