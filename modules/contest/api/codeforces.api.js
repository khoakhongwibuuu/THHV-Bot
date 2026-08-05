const Discord = require('discord.js');
const { contestLib, discordAPI, discordAPIv2 } = global.customLib;
const { client } = global.variable;

const CLOCK_INTERVAL_MINUTES = 5;
const DEBUG_MODE = false;
const NOTIFY_BEFORE_HOURS = 24;
const CODEFORCES_API = 'http://codeforces.com/api/contest.list';

let hasStarted = false;

const fetchData = async (url) => {
	try {
		const response = await fetch(url);
		if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

		const contentType = response.headers.get('content-type');
		const data = contentType.includes('application/json') ? await response.json() : await response.text();

		if (data?.status === 'OK') return data.result;

		console.warn(`[${new Date().toISOString()}] [WARN] Invalid response from codeforces API.`);
		return null;
	} catch (error) {
		console.warn(`[${new Date().toISOString()}] [WARN] Unable to fetch data: ${error.message}`);
		return null;
	}
};

const notify = async (domain, id, name, contestURL, registerURL, startTime, hours) => {
	const persist = await contestLib.loadPersist();
	if (persist === -1 || persist === 0) {
		await contestLib.wipePersist();
		throw new Error("Persist file is corrupted or inaccessible. Restart the bot.");
	}

	const notifiableGuilds = client.guilds.cache
		.map(guild => guild.id)
		.filter(guildId => {
			persist[domain] ??= {};
			persist[domain][guildId] ??= {};
			persist[domain][guildId][hours] ??= [];

			return !persist[domain][guildId][hours].includes(id) &&
				persist.ready?.[guildId] &&
				persist.channel?.[guildId];
		});

	if (!notifiableGuilds.length) return;

	const embed = new Discord.EmbedBuilder()
		.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
		.setTitle(name)
		.setURL(contestURL)
		.setDescription(`Contest starts <t:${startTime / 1000}:F> (<t:${startTime / 1000}:R>)`)
		.setFooter({ text: `${domain} | Sent at:` })
		.setTimestamp();

	const components = new Discord.ActionRowBuilder().addComponents(
		new Discord.ButtonBuilder().setLabel('Register').setURL(registerURL).setStyle(Discord.ButtonStyle.Link),
		new Discord.ButtonBuilder().setLabel('View detail').setURL(contestURL).setStyle(Discord.ButtonStyle.Link)
	);

	await Promise.all(notifiableGuilds.map(async (guildId) => {
		const content = persist.role?.[guildId]
			? `<@&${persist.role[guildId]}>, a contest is open for registration!`
			: "A contest is open for registration!";

		const broadcastChannel = await discordAPIv2.GuildChannel(guildId, persist.channel[guildId]);

		await broadcastChannel.send({
			content,
			embeds: [embed],
			components: [components]
		});

		persist[domain][guildId][hours].push(id);
	}));

	await contestLib.savePersist(persist);
};

const runClock = async () => {
	if (!hasStarted) {
		console.log(`[${new Date().toISOString()}] [INFO] Clock started.`);
		hasStarted = true;
	}

	const contests = await fetchData(CODEFORCES_API);
	if (!contests) return scheduleNextRun();

	const now = Date.now();
	const upcomingContests = contests.filter(contest => contest.phase === 'BEFORE');

	for (const contest of upcomingContests) {
		const startTime = contest.startTimeSeconds * 1000;
		if (startTime - now <= NOTIFY_BEFORE_HOURS * 3600 * 1000) {
			await notify(
				"codeforces.com",
				contest.id,
				contest.name,
				`https://codeforces.com/contests/${contest.id}`,
				`https://codeforces.com/contestRegistration/${contest.id}`,
				startTime,
				NOTIFY_BEFORE_HOURS
			);
		}
	}

	scheduleNextRun();
};

const scheduleNextRun = () => {
	const delay = CLOCK_INTERVAL_MINUTES * 60 * 1000 - new Date().getMilliseconds();
	setTimeout(runClock, delay);
};

const getInitialDelay = () => {
	const now = new Date();
	let minutes = 5 * (Math.floor(now.getMinutes() / 5) + 1) - now.getMinutes();
	let seconds = 0;
	let ms = 0;

	if (now.getSeconds() !== 0) {
		minutes--;
		seconds = 60 - now.getSeconds();
	}
	if (now.getMilliseconds() !== 0) {
		seconds--;
		ms = 1000 - now.getMilliseconds();
		if (seconds === -1) {
			seconds = 59;
			minutes--;
		}
	}

	return minutes * 60000 + seconds * 1000 + ms;
};

module.exports.exec = async () => {
	const delay = DEBUG_MODE ? 1000 : getInitialDelay();
	const readableDelay = DEBUG_MODE
		? "0m-1s-0ms"
		: `${Math.floor(delay / 60000)}m-${Math.floor((delay % 60000) / 1000)}s-${delay % 1000}ms`;

	console.log(`[${new Date().toISOString()}] [INFO] Clock will start in ${readableDelay}.`);
	setTimeout(runClock, delay);
}
