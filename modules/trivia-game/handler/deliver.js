// Packages
const Discord = require('discord.js');
const gameLib = require('#modules/trivia-game/lib/gameLib.js');

const dictionary = {
    easy: "Dễ",
    medium: "Trung bình",
    hard: "Khó"
}

module.exports.execute = async (interaction, cat, difficulty, quest, key, cont, type, time) => {
    const embed = new Discord.EmbedBuilder()
        .setTitle(quest)
        .setDescription(cont);

    let row = null;
    if (type === "multiple") {
        row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId('A')
                    .setLabel('A')
                    .setStyle(Discord.ButtonStyle.Primary),
                new Discord.ButtonBuilder()
                    .setCustomId('B')
                    .setLabel('B')
                    .setStyle(Discord.ButtonStyle.Primary),
                new Discord.ButtonBuilder()
                    .setCustomId('C')
                    .setLabel('C')
                    .setStyle(Discord.ButtonStyle.Primary),
                new Discord.ButtonBuilder()
                    .setCustomId('D')
                    .setLabel('D')
                    .setStyle(Discord.ButtonStyle.Primary)
            );
    } else {
        row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId('True')
                    .setLabel('True')
                    .setStyle(Discord.ButtonStyle.Success),
                new Discord.ButtonBuilder()
                    .setCustomId('False')
                    .setLabel('False')
                    .setStyle(Discord.ButtonStyle.Danger)
            );
    }

    await interaction.reply({
        content: `:alarm_clock: Bạn có \`${time}\` giây để trả lời câu hỏi sau.\nChủ đề: ${cat}\nĐộ khó: ${dictionary[difficulty]}`,
        embeds: [embed],
        components: [row]
    });

    const filter = (interaction) => interaction.isButton();
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: time * 1000 });

    let responseData = {};
    let responseCount = 0;

    collector.on('collect', async (subInteraction) => {
        if (responseData.hasOwnProperty(subInteraction.user.id)) {
            await subInteraction.reply({ content: 'Bạn chỉ được phép trả lời một lần.', ephemeral: true });
        } else {
            if (!await gameLib.isRunning(interaction.guildId)) {
                await subInteraction.reply({ content: 'Không thể ghi nhận câu trả lời của bạn. Lượt chơi này đã bị một người điều phối hủy bỏ.', ephemeral: true })
                    .then(thisMessage => setTimeout(() => thisMessage.delete(), 3000));
            } else {
                responseCount++;
                responseData[subInteraction.user.id] = subInteraction.customId;
                await subInteraction.reply({ content: 'Đã ghi nhận câu trả lời của bạn.', ephemeral: true })
                    .then(thisMessage => setTimeout(() => thisMessage.delete(), 3000));

                interaction.editReply({
                    embeds: [embed
                        .setFooter({
                            text: `${responseCount} người chơi đã tham gia.`
                        })
                    ]
                });
            }
        }
    });

    collector.on('end', async () => {
        // time in seconds to review the question before it disappears
        const timeHidden = 20;
        await interaction.editReply({
            embeds: [embed
                .setFooter({ text: `Lượt chơi này đã kết thúc. ${responseCount} người chơi đã tham gia.` })
            ],
            components: []
        });
        await require('./judge.js').execute(interaction, responseData, key, difficulty, type);
        await interaction.editReply({
            embeds: [embed
                .setDescription(`${cont}\n\nCâu hỏi sẽ bị xóa trong <t:${parseInt(new Date().getTime() / 1000) + timeHidden + 1}:R>.`)
            ]
        });
        setTimeout(async () => {
            await interaction.editReply({
                embeds: []
            });
        }, timeHidden * 1000 - 1000);
    });
}
