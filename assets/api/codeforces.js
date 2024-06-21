// Special library
const fs = require('fs');
const Discord = require('discord.js');

// Basic variables
const client = global.client;
const stdlib = global.stdlib;
const dirname = global.dirname;
const coreLib = global.coreLib;

// Load settings from core.json
const notificationHour = coreLib.load().notificationHour;
const notificationRole = coreLib.load().notificationRole;

// Special API
const Persist = JSON.parse(fs.readFileSync(dirname + '/configs/persist.json', 'utf8'));
const savePersist = () => { fs.writeFileSync(dirname + '/configs/persist.json', JSON.stringify(Persist)); }

// Clock setting
let Tolerance = 5; // Alert if codeforces API is unavailable for 20 minutes
const clockInterval = 5; // Connect to codeforces.com after every 5 minutes

const notify = (domain, id, name, contesturl, registerurl, startTime, hours) => {
	const notifiable = client.guilds.cache.filter(guild => {
		if (!Persist[domain]) Persist[domain] = {};
		if (!Persist[domain][guild.id]) Persist[domain][guild.id] = {};
		if (!Persist[domain][guild.id][hours]) Persist[domain][guild.id][hours] = [];
		return Persist[domain][guild.id][hours].indexOf(id) < 0;
	});
	notifiable.forEach(guild => {
		if (!Persist.ready[guild.id]) return;

		// Init destination
		const channelID = Persist.channel[guild.id];
		const channel = guild.channels.cache.get(channelID);

		// Create Embed
		const embed = new Discord.EmbedBuilder()
			.setAuthor({
				name: client.user.username,
				iconURL: client.user.displayAvatarURL()
			})
			.setTitle(name)
			.setURL(contesturl)
			.setDescription(`Contest starts <t:${startTime / 1000}:F>`)
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
		channel.send({
			content: (notificationRole === "") ? "Upcoming contest announced!" : `<@&${notificationRole}>, upcoming contest announced!`,
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
	fetch('http://codeforces.com/api/contest.list')
		.then(data => data.json())
		.then(res => {
			if (res.status === 'OK') {
				const list = res.result.filter(contest => contest.phase === 'BEFORE');
				(`[${new Date().toISOString()}] [INFO] Client: Connected successfully. Found ${list.length} scheduled contests.`).logE();
				Tolerance = 5;
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
				Tolerance--;
				if (Tolerance > 0)
					(`[${new Date().toISOString()}] [WARN] Client: server is busy. Try connect again in ${clockInterval} minutes.`).logE();
				else {
					(`[${new Date().toISOString()}] [WARN] Client: server is busy.`).logE();
				}
			}
		})
		.catch(err => {
			Tolerance--;
			(`[${new Date().toISOString()}] [WARN] Client: Cannot connect to codeforces.com. Details of this error:`).logE();
			console.log(err);
		});
	setTimeout(clock, 1000 * 60 * clockInterval - new Date().getMilliseconds());
}

const exec = () => {
	setTimeout(clock, 1000 * (60 - new Date().getSeconds()));
}

module.exports.exec = exec;