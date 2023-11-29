// Special library
const nf = require('node-fetch');
const fs = require('fs');

// Basic variables
const client = global.client;
const Utils = global.Utils;
const dirname = global.dirname;

const defaultLang = require('./configAPI.js').loadDefaultLanguage();
const config = require('./configAPI.js').loadRawData();
const lang = require('./configAPI.js').loadLanguage();
const server = require('./serverAPI.js').loadRawData();

// Special API
const Persist = JSON.parse(fs.readFileSync(dirname + '/configs/persist.json', 'utf8'));
const savePersist = () => { fs.writeFileSync(dirname + '/configs/persist.json', JSON.stringify(Persist)); }

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
				color: parseInt(defaultLang.status.info, 16),
				description: `${lang.notify_desc}<t:${startTime / 1000}:R>`,
				footer: {
					text: `${res} | ${lang.notify_foot}`
						+ `${new Date(startTime.getTime() + (config.timezone - Utils.server_timezone()) * 3600 * 1000).toLocaleString('vi-vn', { hour12: false })}`
						+ ` UTC${Utils.number_format(config.timezone)}`
				}
			}
		}).then(sendMsg => sendMsg.react('700345520081600512'));
		Persist[res][guild.id][type].push(id);
		savePersist();
	});
}

let list = [];
const doNotify = (res) => {
	list.forEach(obj => {
		const startTime = new Date(parseInt(obj.startTimeSeconds) * 1000);
		const rtime = -obj.relativeTimeSeconds;
		config.notify_hours.forEach(mark => {
			if (rtime <= mark * 3600) {
				notify(res, obj.id, obj.name, `https://codeforces.com/contests/${obj.id}`, startTime, mark);
			}
		})
	});
}

let errorTolerance = 5;
const clock = () => {
	nf('http://codeforces.com/api/contest.list')
		.then(data => data.json())
		.then(res => {
			if (res.status === 'OK') {
				list = res.result.filter(obj => obj.phase === 'BEFORE');
				if (errorTolerance <= 0)
					if (server.log_channel !== "")
						Utils.deliverMsg(lang.api.codeforces.on + " :white_check_mark: \n" + lang.api.notification.on, "info", server.log_channel);
				errorTolerance = 5;
				doNotify('codeforces.com');
			} else {
				errorTolerance--;
				if (errorTolerance === 0)
					if (server.log_channel !== "")
						Utils.deliverMsg(lang.api.codeforces.busy + " :x: \n" + lang.api.notification.off, "warning", server.log_channel);
			}
		})
		.catch(err => {
			errorTolerance--;
			if (errorTolerance === 0)
				if (server.log_channel !== "")
					Utils.deliverMsg(lang.api.codeforces.off + " :x: \n" + lang.api.notification.off, "warning", server.log_channel);
		});
	setTimeout(clock, 1000 * (300 - new Date().getSeconds()));
}

const fetch = () => {
	setTimeout(clock, 1000 * (60 - new Date().getSeconds()));
}

module.exports.fetch = fetch;