const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const dirname = global.dirname;
const stdlib = global.stdlib;

const execute = (interaction, cat, diff, quest, key, cont, mode, ETA) => {
    // Create an embed
    const embed = new EmbedBuilder()
        .setTitle(quest)
        .setDescription(cont);

    // Create buttons
    let row = null;
    if (mode === "multiple") {
        row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('A')
                    .setLabel('A')
                    .setStyle('Secondary'),
                new ButtonBuilder()
                    .setCustomId('B')
                    .setLabel('B')
                    .setStyle('Secondary'),
                new ButtonBuilder()
                    .setCustomId('C')
                    .setLabel('C')
                    .setStyle('Secondary'),
                new ButtonBuilder()
                    .setCustomId('D')
                    .setLabel('D')
                    .setStyle('Secondary')
            );
    } else {
        row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('True')
                    .setLabel('A')
                    .setStyle('Secondary'),
                new ButtonBuilder()
                    .setCustomId('False')
                    .setLabel('B')
                    .setStyle('Secondary')
            );
    }

    // Send the embed with buttons
    interaction.reply({
        content: `:alarm_clock: You have \`${ETA}\` seconds for this question.\nTopic: \`${cat}\`\nDifficulty: \`${diff}\``,
        embeds: [embed],
        components: [row]
    });

    // Create a collector to collect button clicks
    const filter = (interaction) => interaction.isButton();
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: ETA * 1000 });

    // Create a set to store user IDs who have clicked
    let responseData = {};
    let memberVotedCount = 0;

    // Handle button clicks
    collector.on('collect', async (subInteraction) => {
        if (responseData.hasOwnProperty(subInteraction.user.id)) {
            await subInteraction.reply({ content: 'You must not respond more than once.', ephemeral: true });
        } else {
            memberVotedCount++;
            responseData[subInteraction.user.id] = subInteraction.customId;
            await subInteraction.reply({ content: 'Successfully recorded your response.', ephemeral: true });
        }
    });

    collector.on('end', () => {
        interaction.editReply({ embeds: [embed.setFooter({ text: "This session has ended." }).setTimestamp()], components: [] });
        require('./judge.js').execute(interaction, responseData, key);
    });
}

module.exports.execute = execute;