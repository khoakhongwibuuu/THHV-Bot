// Special library
const fs = require('fs');
const Discord = require('discord.js');

// Basic variables
const client = global.client;
const stdlib = global.stdlib;
const dirname = global.dirname;
const coreLib = global.coreLib;
const discordAPI = global.discordAPI;

// Load settings from core.json
const notificationHour = coreLib.load().notificationHour;
const notificationRole = coreLib.load().notificationRole;
const owner = coreLib.load().owner;

// Special API
const Persist = JSON.parse(fs.readFileSync(dirname + '/configs/persist.json', 'utf8'));
const savePersist = () => { fs.writeFileSync(dirname + '/configs/persist.json', JSON.stringify(Persist)); }

// Clock setting
const clockInterval = 5; // Connect to codeforces.com after every 5 minutes

// API link
const CODEFORCES_API = 'http://codeforces.com/api/contest.list'

const notify = (domain, id, name, contesturl, registerurl, startTime, hours) => {
	const notifiable = client.guilds.cache.filter(guild => {
		if (!Persist[domain]) Persist[domain] = {};
		if (!Persist[domain][guild.id]) Persist[domain][guild.id] = {};
		if (!Persist[domain][guild.id][hours]) Persist[domain][guild.id][hours] = [];
		return Persist[domain][guild.id][hours].indexOf(id) < 0;
	});
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
			content: (notificationRole === "")
				? "Upcoming contest announced!"
				: `<@&${notificationRole}>, upcoming contest announced!`,
			embeds: [embed],
			components: [row]
		});

		// save Persist
		Persist[domain][guild.id][hours].push(id);
		savePersist();
	});
}

const clock = () => {
	(`[${new Date().toISOString()}] [INFO] Client: start connecting to codeforces.com.`).logE();
	fetch(CODEFORCES_API)
		.then(data => data.json())
		.then(res => {
			if (res.status === 'OK') {
				const list = res.result.filter(contest => contest.phase === 'BEFORE');
				(`[${new Date().toISOString()}] [INFO] Client: connected successfully. Found ${list.length} scheduled contests.`).logE();

				list.forEach(contest => {
					const startTime = new Date(parseInt(contest.startTimeSeconds) * 1000);
					const rtime = -contest.relativeTimeSeconds;
					if (rtime <= notificationHour * 3600) {
						notify("codeforces.com", contest.id, contest.name,
							`https://codeforces.com/contests/${contest.id}`,
							`https://codeforces.com/contestRegistration/${contest.id}`,
							startTime, notificationHour);
					}
				});
			} else {
				(`[${new Date().toISOString()}] [WARN] Client: server is busy. Try connecting again in ${clockInterval} minutes.`).logE();
			}
		})
		.catch(err => {
			(`[${new Date().toISOString()}] [WARN] Client: host unreachable. Try connecting again in ${clockInterval} minutes.`).logE();
			console.log(err);
		});
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
	const now = new Date();
	const delay = getDelay(now);
	(`[${new Date().toISOString()}] [INFO] Client: the clock will start in ${delay.m}m-${delay.s}s-${delay.ms}ms.`).logE();
	setTimeout(clock, delay.m * 60 * 1000 + delay.s * 1000 + delay.ms);
}

module.exports.exec = exec;