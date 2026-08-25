const Discord = require('discord.js');
const contestLib = require('#modules/contest/lib/contestLib.js');
const discordAPIv2 = require('#assets/api/discord.api.v2.js');
const { client } = require('#assets/library/state.js');

const NOTIFY_BEFORE_HOURS = 24000;
const CODEFORCES_API = 'http://codeforces.com/api/contest.list';

const fetchData = async (url) => {
	try {
		const response = await fetch(url);
		if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

		const contentType = response.headers.get('content-type');
		const data = contentType.includes('application/json') ? await response.json() : await response.text();

		if (data?.status === 'OK') return data.result;

		console.warn(`[${new Date().toISOString()}] [WARN] module/contest: Invalid response from codeforces API.`);
		return null;
	} catch (error) {
		console.warn(`[${new Date().toISOString()}] [WARN] module/contest: Unable to fetch data: ${error.message}`);
		return null;
	}
};

const notify = async (domain, id, name, contestURL, registerURL, startTime, hours) => {
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

    const guilds = client.guilds.cache.map(guild => guild.id);

	await Promise.all(guilds.map(async (guildId) => {
        if (!(await contestLib.isSetup(guildId))) return;

        const hasBeenNotified = await contestLib.hasBeenNotified(guildId, domain, hours, id);
        if (hasBeenNotified) return;

        const config = await contestLib.getGuildConfig(guildId);
        if (!config || !config.channel) return;

		const content = config.role
			? `<@&${config.role}>, a contest is open for registration!`
			: "A contest is open for registration!";

        try {
		    const broadcastChannel = await discordAPIv2.GuildChannel(guildId, config.channel);
            if (broadcastChannel) {
                await broadcastChannel.send({
                    content,
                    embeds: [embed],
                    components: [components]
                });

                await contestLib.markAsNotified(guildId, domain, hours, id);
            }
        } catch (err) {
            console.error(`[ERROR] module/contest: Failed to send notification to guild ${guildId}:`, err);
        }
	}));
};

const checkContests = async () => {
	const contests = await fetchData(CODEFORCES_API);
	if (!contests) return;

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
};

module.exports = { checkContests };