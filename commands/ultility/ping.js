const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ping = require('ping');

async function pingServer(url) {
    try {
        let res = await ping.promise.probe(url);
        let latency = res.time;
        return latency;
    } catch (error) {
        console.error(error);
        return 'Error pinging server';
    }
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check latency when connecting to APIs!'),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: false });
        const PingResult = new EmbedBuilder()
            .setFooter({ text: `Requested by ${interaction.user.username} at ` })
            .setTimestamp();
        const discordLatency = await pingServer('discord.com');
        const codeforcesLatency = await pingServer('codeforces.com');
        const opentdbLatency = await pingServer('opentdb.com');
        PingResult.addFields(
            {
                name: "Discord",
                value: `\`\`\`json\n${discordLatency}ms\`\`\``,
                inline: true
            },
            {
                name: "Codeforces",
                value: `\`\`\`json\n${(codeforcesLatency != "unknown") ? codeforcesLatency + 'ms' : '.dead'}\`\`\``,
                inline: true
            },
            {
                name: "opentdb",
                value: `\`\`\`json\n${(opentdbLatency != "unknown") ? opentdbLatency + 'ms' : '.dead'}\`\`\``,
                inline: true
            }
        );

        await interaction.editReply({
            embeds: [PingResult]
        });
    },
};
