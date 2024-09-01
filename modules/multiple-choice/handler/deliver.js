const path = require('path');
const Discord = require('discord.js');

// Universal
const dirname = global.dirname;
const stdlib = global.stdlib;
const discordAPI = global.discordAPI;

// Module Specified
const mcLib = require(path.join(dirname, 'modules/multiple-choice/lib/gameLib.js'));
const dictionary = {
    easy: "Dễ",
    medium: "Trung bình",
    hard: "Khó"
}

const execute = (interaction, cat, diff, quest, key, cont, mode, ETA) => {
    console.log(key);
    const embed = new Discord.EmbedBuilder()
        .setTitle(quest)
        .setDescription(cont);

    let row = null;
    if (mode === "multiple") {
        row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId('A')
                    .setLabel('A')
                    .setStyle('Primary'),
                new Discord.ButtonBuilder()
                    .setCustomId('B')
                    .setLabel('B')
                    .setStyle('Primary'),
                new Discord.ButtonBuilder()
                    .setCustomId('C')
                    .setLabel('C')
                    .setStyle('Primary'),
                new Discord.ButtonBuilder()
                    .setCustomId('D')
                    .setLabel('D')
                    .setStyle('Primary')
            );
    } else {
        row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId('True')
                    .setLabel('True')

                    .setStyle('Success'),
                new Discord.ButtonBuilder()
                    .setCustomId('False')
                    .setLabel('False')

                    .setStyle('Danger')
            );
    }

    interaction.reply({
        content: `:alarm_clock: Bạn có \`${ETA}\` giây để trả lời câu hỏi sau.\nChủ đề: ${cat}\nĐộ khó: ${dictionary[diff]}`,
        embeds: [embed],
        components: [row]
    });

    const filter = (interaction) => interaction.isButton();
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: ETA * 1000 });

    let responseData = {};
    let memberVotedCount = 0;

    collector.on('collect', async (subInteraction) => {
        if (responseData.hasOwnProperty(subInteraction.user.id)) {
            await subInteraction.reply({ content: 'Bạn chỉ được phép trả lời một lần.', ephemeral: true });
        } else {
            if (!mcLib.isRunning(interaction.guildId)) {
                await subInteraction.reply({ content: 'Không thể ghi nhận câu trả lời của bạn. Lượt chơi này đã bị một người điều phối hủy bỏ.', ephemeral: true })
                    .then(thisMessage => setTimeout(() => thisMessage.delete(), 3000));
            } else {
                memberVotedCount++;
                responseData[subInteraction.user.id] = subInteraction.customId;
                await subInteraction.reply({ content: 'Đã ghi nhận câu trả lời của bạn.', ephemeral: true })
                    .then(thisMessage => setTimeout(() => thisMessage.delete(), 3000));

                interaction.editReply({
                    embeds: [embed
                        .setFooter({
                            text: `${memberVotedCount} người chơi đã tham gia.`
                        })
                    ]
                });
            }
        }
    });

    collector.on('end', () => {
        // time in seconds to review the question before it disappears
        const timeHidden = 20;
        interaction.editReply({
            embeds: [embed
                .setFooter({ text: `Lượt chơi này đã kết thúc. ${memberVotedCount} người chơi đã tham gia.` })
            ],
            components: []
        });
        require('./judge.js').execute(interaction, responseData, key);
        interaction.editReply({
            embeds: [embed
                .setDescription(`${cont}\n\nCâu hỏi sẽ bị xóa trong <t:${parseInt(new Date().getTime() / 1000) + timeHidden + 1}:R>.`)
            ]
        });
        setTimeout(() => {
            interaction.editReply({
                embeds: []
            });
        }, timeHidden * 1000);
    });
}

module.exports.execute = execute;