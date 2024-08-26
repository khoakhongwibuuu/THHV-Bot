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
const debugMode = false;

// notify contest 24h before it starts
const demandHours = 24;

// API link
const CODEFORCES_API = 'http://codeforces.com/api/contest.list'

const notify = (domain, id, name, contesturl, registerurl, startTime, hours) => {
	const notifiable = client.guilds.cache.filter(guild => {
		if (!Persist[domain]) Persist[domain] = {};
		if (!Persist[domain][guild.id]) Persist[domain][guild.id] = {};
		if (!Persist[domain][guild.id][hours]) Persist[domain][guild.id][hours] = [];
		return Persist[domain][guild.id][hours].indexOf(id) < 0;
	});
	(`[${new Date().toISOString()}] [INFO] Client: data processed successfully. Found ${notifiable.length} notifiable servers.`).logOffline();
	notifiable.forEach(guild => {
		if (!Persist.ready[guild.id]) return;

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

		// Create action row from buttons
		const row = new Discord.ActionRowBuilder()
			.addComponents(webviewbtn, registerbtn);

		// Deliver
		const guildId = guild.id;
		const channelId = Persist.channel[guild.id];
		discordAPI.GuildChannel(guildId, channelId).send({
			content: (Persist.role[guild.id] === "")
				? "Upcoming contest announced!"
				: `<@&${Persist.role[guild.id]}>, upcoming contest announced!`,
			embeds: [embed],
			components: [row]
		});

		// save Persist
		Persist[domain][guild.id][hours].push(id);
		cfLib.savePersist(Persist);
	});
}

const clock = () => {
	(`[${new Date().toISOString()}] [INFO] Client: start connecting to codeforces.com.`).logOffline();
	fetch(CODEFORCES_API)
		.then(response => {
			const contentType = response.headers.get('content-type');
			return (contentType && contentType.includes('application/json')) ? response.json() : response.text();
		})
		.then(response => {
			if (typeof response === 'object') {
				if (response.status === 'OK') {
					const list = response.result.filter(contest => contest.phase === 'BEFORE');
					(`[${new Date().toISOString()}] [INFO] Client: connected successfully. Found ${list.length} scheduled contests.`).logOffline();

					list.forEach(contest => {
						const startTime = new Date(parseInt(contest.startTimeSeconds) * 1000);
						const rtime = -contest.relativeTimeSeconds;
						if (rtime <= demandHours * 3600) {
							notify("codeforces.com", contest.id, contest.name,
								`https://codeforces.com/contests/${contest.id}`,
								`https://codeforces.com/contestRegistration/${contest.id}`,
								startTime, demandHours);
						}
					});
				} else {
					(`[${new Date().toISOString()}] [WARN] Client: server is busy. Try connecting again in ${clockInterval} minutes.`).logOffline();
				}
			} else {
				(`[${new Date().toISOString()}] [WARN] Client: invalid data. Try connecting again in ${clockInterval} minutes.`).logOffline();
			}
		})
		.catch(err => {
			(`[${new Date().toISOString()}] [WARN] Client: host unreachable. Try connecting again in ${clockInterval} minutes.`).logOffline();
			console.log(err);
		})
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
		(`[${new Date().toISOString()}] [INFO] Client: the clock will start in ${delay.m}m-${delay.s}s-${delay.ms}ms.`).logOffline();
		setTimeout(clock, delay.m * 60 * 1000 + delay.s * 1000 + delay.ms);
	} else {
		(`[${new Date().toISOString()}] [INFO] Client: the clock will start in ${0}m-${3}s-${0}ms.`).logOffline();
		setTimeout(clock, 3000);
	}
}

module.exports.exec = exec;