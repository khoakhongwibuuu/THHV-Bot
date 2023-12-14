const Discord = require('discord.js');
const dirname = global.dirname;
const stdlib = global.stdlib;
const execute = (interaction, cat, diff, quest, key, cont, mode, ETA) => {
    const emojiMap = require(dirname + '/assets/misc/emojiCharacters.js');

    // Create an embed
    const embed = new Discord.EmbedBuilder()
        .setTitle(quest)
        .setDescription(cont);

    // Create buttons
    let row = null;
    if (mode === "multiple") {
        row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId('A')
                    .setEmoji(emojiMap.a)
                    .setStyle('Primary'),
                new Discord.ButtonBuilder()
                    .setCustomId('B')
                    .setEmoji(emojiMap.b)
                    .setStyle('Primary'),
                new Discord.ButtonBuilder()
                    .setCustomId('C')
                    .setEmoji(emojiMap.c)
                    .setStyle('Primary'),
                new Discord.ButtonBuilder()
                    .setCustomId('D')
                    .setEmoji(emojiMap.d)
                    .setStyle('Primary')
            );
    } else {
        row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId('True')
                    .setLabel('True')
                    // .setEmoji(serverLib.load().emoji.yes)
                    .setStyle('Success'),
                new Discord.ButtonBuilder()
                    .setCustomId('False')
                    .setLabel('False')
                    // .setEmoji(serverLib.load().emoji.no)
                    .setStyle('Danger')
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
            // console.log(emb)
            interaction.editReply({
                embeds: [embed
                    .setFooter({
                        text: `Received ${memberVotedCount} response${(memberVotedCount > 1) ? 's' : ''}.`
                    })
                ]
            });
        }
    });

    collector.on('end', () => {
        interaction.editReply({
            embeds: [embed
                .setFooter({ text: "This session has ended." })
            ],
            components: []
        });
        require('./judge.js').execute(interaction, responseData, key);
    });
}

module.exports.execute = execute;