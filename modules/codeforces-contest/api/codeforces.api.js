// Packages
const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');

// Universal
const client = global.client;
const stdlib = global.stdlib;
const dirname = global.dirname;
const discordAPI = global.discordAPI;

// Module Specified
const cfLib = global.cfLib;
const Persist = cfLib.loadPersist();

// Clock setting: connect to codeforces.com after every 5 minutes
const clockInterval = 5;

// Debugging settings
const debugMode = true;

// notify contest 24h before it starts
const demandHours = 24;

// API link
const CODEFORCES_CONTEST_API = 'http://codeforces.com/api/contest.list'

// Fetcher
const fetchData = async (apiLink) => {
	try {
		const response = await fetch(apiLink);
		const contentType = response.headers.get('content-type');
		const data = contentType.includes('application/json')
			? await response.json()
			: await response.text();

		if (typeof data === 'object' && data.status === 'OK') {
			return data.result;
		}
		console.log(`[${new Date().toISOString()}] [WARN] Client: invalid data. Try connecting again in ${clockInterval} minutes.`);
		return null;
	} catch (err) {
		console.log(`[${new Date().toISOString()}] [WARN] Client: host unreachable. Try connecting again in ${clockInterval} minutes.`);
		console.error(err);
		return null;
	}
}

const notify = (domain, id, name, contesturl, registerurl, startTime, hours) => {
	const notifiable = client.guilds.cache.filter(guild => {
		if (!Persist[domain]) Persist[domain] = {};
		if (!Persist[domain][guild.id]) Persist[domain][guild.id] = {};
		if (!Persist[domain][guild.id][hours]) Persist[domain][guild.id][hours] = [];
		return Persist[domain][guild.id][hours].indexOf(id) < 0;
	});

	if (notifiable.length > 0) {
		// Create Embed
		const embed = new Discord.EmbedBuilder()
			.setAuthor({
				name: client.user.username,
				iconURL: client.user.displayAvatarURL()
			})
			.setTitle(name)
			.setURL(contesturl)
			.setDescription(`Contest starts <t:${startTime / 1000}:F> (<t:${startTime / 1000}:R>)`)
			.setFooter({
				text: `${domain} | This message was sent at`
			})
			.setTimestamp();

		// Create buttons
		const registerbtn = new Discord.ButtonBuilder()
			.setLabel('Register')
			.setURL(registerurl)
			.setStyle(Discord.ButtonStyle.Link);

		const webviewbtn = new Discord.ButtonBuilder()
			.setLabel('View detail')
			.setURL(contesturl)
			.setStyle(Discord.ButtonStyle.Link);

		// Create buttons rows
		const componentsRows = new Discord.ActionRowBuilder()
			.addComponents(webviewbtn, registerbtn);

		notifiable.forEach(async guild => {
			if (!Persist.ready[guild.id]) return;

			await discordAPI.GuildChannel(guild.id, Persist.channel[guild.id]).send({
				content: (!Persist.role[guild.id] || Persist.role[guild.id] === "")
					? "A contest is open for registration!"
					: `<@&${Persist.role[guild.id]}>, a contest is open for registration!`,
				embeds: [embed],
				components: [componentsRows]
			});

			Persist[domain][guild.id][hours].push(id);
			cfLib.savePersist(Persist);
		});
	}
}

const clock = async () => {
	const contestList = await fetchData(CODEFORCES_CONTEST_API);
	if (contestList) {
		const currentTime = new Date().getTime();

		const before = contestList.filter(contest => contest.phase === 'BEFORE');
		before.forEach(contest => {
			const startTime = parseInt(contest.startTimeSeconds) * 1000;
			const rtime = startTime - currentTime;
			if (rtime <= demandHours * 3600 * 1000) {
				notify("codeforces.com", contest.id, contest.name,
					`https://codeforces.com/contests/${contest.id}`,
					`https://codeforces.com/contestRegistration/${contest.id}`,
					startTime, demandHours);
			}
		});
	}
	setTimeout(clock, 1000 * 60 * clockInterval - new Date().getMilliseconds());
}

const getDelay = (now) => {
	let minutes = 5 * (Math.floor(now.getMinutes() / 5) + 1) - now.getMinutes();
	let seconds = 0;
	let miliSeconds = 0;
	if (now.getSeconds() !== 0) {
		minutes--;
		seconds = 60 - now.getSeconds();
	}

	if (now.getMilliseconds() !== 0) {
		seconds--;
		miliSeconds = 1000 - now.getMilliseconds();
		if (seconds === -1) {
			seconds = 59;
			minutes--;
		}
	}

	return {
		m: minutes,
		s: seconds,
		ms: miliSeconds
	};
}

const exec = () => {
	if (!debugMode) {
		const now = new Date();
		const delay = getDelay(now);
		console.log(`[${new Date().toISOString()}] [INFO] Client: the clock will start in ${delay.m}m-${delay.s}s-${delay.ms}ms.`);
		setTimeout(clock, delay.m * 60 * 1000 + delay.s * 1000 + delay.ms);
	} else {
		console.log(`[${new Date().toISOString()}] [INFO] Client: the clock will start in ${0}m-${3}s-${0}ms.`);
		setTimeout(clock, 3000);
	}
}

module.exports.exec = exec;