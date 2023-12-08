const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const dirname = global.dirname;
const stdlib = global.stdlib;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('now')
        .setDescription('Show current time.'),
    async execute(interaction) {
        const coreLib = require(dirname + '/assets/library/core.js').load();
        const serverTimezone = stdlib.serverTimezone();
        const defaultTimezone = coreLib.timezone;
        const penalty = (defaultTimezone - serverTimezone) * 3600000;
        const now = new Date(new Date().getTime() + penalty);
        const sentEmbed = new EmbedBuilder()
            .addFields(
                {
                    name: "Year",
                    value: `\`\`\`\n${now.getFullYear().toString()}\`\`\``,
                    inline: true
                },
                {
                    name: "Month",
                    value: `\`\`\`\n${now.getFullMonth().toString()}\`\`\``,
                    inline: true
                },
                {
                    name: "Day",
                    value: `\`\`\`\n${now.getDate().toString()}\`\`\``,
                    inline: true
                },
                {
                    name: "Hours",
                    value: `\`\`\`\n${now.getHours().toString()}\`\`\``,
                    inline: true
                },
                {
                    name: "Minutes",
                    value: `\`\`\`\n${now.getMinutes().toString()}\`\`\``,
                    inline: true
                },
                {
                    name: "Seconds",
                    value: `\`\`\`\n${now.getSeconds().toString()}\`\`\``,
                    inline: true
                },
                {
                    name: "Timezone",
                    value: `\`\`\`\nUTC${defaultTimezone.numFormat().toString()}\`\`\``,
                    inline: true
                },
                {
                    name: "#Day of week",
                    value: `\`\`\`\n${now.getDayOfWeek().toString()}\`\`\``,
                    inline: true
                },
            )
            .setFooter({ text: `Requested by ${interaction.user.username} at ` })
            .setTimestamp();
        interaction.reply({ embeds: [sentEmbed] })
    },
};