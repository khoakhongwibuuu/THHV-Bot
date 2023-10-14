const nf = require('node-fetch');

// Basic variables
const client = global.client;
const Config = global.Config;
const Lang = global.Lang;
const Utils = global.Utils;
const Base_Lang = global.Base_Lang;

// Special API
const Persist = global.Persist;
const savePersist = global.savePersist;
const server = global.server;

const notify = (res, id, name, url, startTime, type) => {
	client.guilds.filter(guild => {
		if (!Persist[res]) Persist[res] = {};
		if (!Persist[res][guild.id]) Persist[res][guild.id] = {};
		if (!Persist[res][guild.id][type]) Persist[res][guild.id][type] = [];
		return Persist[res][guild.id][type].indexOf(id) < 0;
	}).array().forEach(guild => {
		if (!Persist.ready[guild.id]) return;
		const channelID = Persist.channel[guild.id];
		const channel = guild.channels.get(channelID);
		if (!channel || !channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;
		channel.send((server.notify_role === "") ? "Upcoming contest announced!" : `<@&${server.notify_role}>, upcoming contest announced!`, {
			embed: {
				author: {
					name: client.user.username,
					icon_url: client.user.displayAvatarURL()
				},
				title: name,
				url: url,
				color: parseInt(Base_Lang.status.info, 16),
				description: `${Lang.notify_desc}<t:${startTime / 1000}:R>`,
				footer: {
					text: `${res} | ${Lang.notify_foot}`
						+ `${new Date(startTime.getTime() + (Config.timezone - Utils.server_timezone()) * 3600 * 1000).toLocaleString('vi-vn', { hour12: false })}`
						+ ` UTC${Utils.number_format(Config.timezone)}`
				}
			}
		});
		Persist[res][guild.id][type].push(id);
		savePersist();
	});
}
let list = [];
const doNotify = (res) => {
	list.forEach(obj => {
		const startTime = new Date(parseInt(obj.startTimeSeconds) * 1000);
		const rtime = -obj.relativeTimeSeconds;
		Config.notify_hours.forEach(mark => {
			if (rtime <= mark * 3600) {
				notify(res, obj.id, obj.name, `https://codeforces.com/contests/${obj.id}`, startTime, mark);
			}
		})
	});
}
let errorTolerance = 2;
let HasDisconnected = false;

const clock = () => {
	console.log(`\n${Utils.timestampToDate(new Date().getTime(), 'full', 0)}`);
	console.log(`${HasDisconnected ? "Rec" : "C"}onnecting to codeforces.com`);
	nf('http://codeforces.com/api/contest.list')
		.then(data => data.json())
		.then(res => {
			if (res.status === 'OK') {
				console.log("Connected successfully! This connection will expire after 1 minute.");
				list = res.result.filter(obj => obj.phase === 'BEFORE');
				if (errorTolerance <= 0) {
					// console.log("API works again");
					Utils.deliverMsg(Lang.api.codeforces.on + " :white_check_mark: \n" + Lang.api.notification.on, "info", server.log_channel);
				}
				errorTolerance = 5;
				doNotify('codeforces.com');
			} else {
				console.log(`Server is busy. Trying again in 1 minute. ${Math.max(errorTolerance, 0)} attempt${errorTolerance > 1 ? "s" : ""} remaining before alarming.`);
				errorTolerance--;
				if (errorTolerance === 0) {
					// console.log("API not working");
					Utils.deliverMsg(Lang.api.codeforces.off + " :x: \n" + Lang.api.notification.off, "warning", server.log_channel);
				}
			}
		})
		.catch(err => {
			errorTolerance--;
			console.log(`Destination host unreachable. Trying again in 1 minute. ${Math.max(errorTolerance, 0)} attempt${errorTolerance > 1 ? "s" : ""} remaining before alarming.`);
			if (errorTolerance === 0) {
				// console.log("API not working");
				Utils.deliverMsg(Lang.api.codeforces.off + " :x: \n" + Lang.api.notification.off, "warning", server.log_channel);
			}
		});
	if (!HasDisconnected) HasDisconnected = true;
	setTimeout(() => {
		setTimeout(clock, 1000 * (60 - new Date().getSeconds()));
	}, 1000);
}

const fetch = () => {
	console.log(`\nPlease wait. The clock will start after ${60 - new Date().getSeconds()}s.`);
	setTimeout(clock, 1000 * (60 - new Date().getSeconds()));
}

module.exports.fetch = fetch;