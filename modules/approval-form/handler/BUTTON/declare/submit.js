const Discord = require('discord.js');
const { memory, formLib, discordAPI } = global.customLib;

const emailTokenBreak = (tokens) => {
    let result = '';
    for (i = 0; i < tokens.length; i++) {
        let trimmed = tokens[i].trim()
        result += trimmed;
        if (i !== tokens.length - 1) {
            result += '\n';
        }
    }
    return result;
}

const socialTokenBreak = (prefix, tokens) => {
    let result = '';
    for (i = 0; i < tokens.length; i++) {
        let trimmed = tokens[i].trim()
        result += `[${trimmed}](${prefix}${trimmed})`
        if (i !== tokens.length - 1) {
            result += '\n';
        }
    }
    return result;
}

module.exports.exec = async (interaction, UUID) => {
    const data = memory.getData(UUID);
    if (!data) {
        await interaction.reply({
            ephemeral: true,
            content: `Đã có lỗi xảy ra. Vui lòng huỷ yêu cầu và thử khai báo lại.`
        });
        return;
    }
    if (!formLib.isSetup(data.guildId)) {
        await interaction.reply({
            ephemeral: true,
            content: `Đã có lỗi nghiêm trọng xảy ra.`
        });
        return;
    }

    memory.deleteData(UUID);
    formLib.addMemberToApprovalQueue(data.guildId, interaction.user.id);

    await interaction.reply({
        ephemeral: true,
        content: "Đã gửi yêu cầu khai báo đến các Moderator/Admin Tin học Hùng Vương."
    });

    await interaction.message.delete();

    await discordAPI.GuildChannel(data.guildId, formLib.getGuildConfig(data.guildId).receive).send({
        embeds: [
            new Discord.EmbedBuilder()
                .setFooter({
                    text: `🕒 Đang chờ xác thực`
                })
                .setTitle("Yêu cầu khai báo thành viên")
                .setDescription(
                    `* Người tạo yêu cầu: <@${interaction.user.id}> `
                    + `\n * Thời điểm tạo yêu cầu: <t:${Math.floor(interaction.createdTimestamp / 1000)}:F>`
                )
                .addFields(
                    {
                        name: "**Họ và tên**",
                        value: `||\`\`\`${data.basic.fullName}\`\`\`||`,
                        inline: false
                    },
                    {
                        name: "**Khoá**",
                        value: `\`\`\`${data.basic.schoolYear}\`\`\``,
                        inline: false
                    },
                    {
                        name: "**Địa chỉ Email**",
                        value: `||\`\`\`${emailTokenBreak(data.social.Email.split(','))}\`\`\`||`,
                        inline: false
                    },
                    {
                        name: "**Codeforces**",
                        value: socialTokenBreak('https://codeforces.com/profile/', data.social.Codeforces.split(',')),
                        inline: true
                    },
                    {
                        name: "**VNOI OJ**",
                        value: socialTokenBreak('https://oj.vnoi.info/user/', data.social.VNOI.split(',')),
                        inline: true
                    },
                    {
                        name: "**Các năm tham gia kì thi HSGQG**",
                        value: data.rewards.VOI ? `\`\`\`${data.rewards.VOI}\`\`\`` : "Không có",
                        inline: false
                    },
                    {
                        name: "**Các giải thưởng tin học khác**",
                        value: data.rewards.others ? `\`\`\`${data.rewards.others}\`\`\`` : "Không có",
                        inline: false
                    },
                    {
                        name: "**Ghi chú thêm**",
                        value: data.notes ? `\`\`\`${data.notes}\`\`\`` : "Không có",
                        inline: false
                    },
                )
        ],
        components: [
            new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder()
                    .setLabel("Accept")
                    .setCustomId(`approval-form:BUTTON:moderation/accept-declare:${interaction.user.id}`)
                    .setStyle(Discord.ButtonStyle.Success)
                ,
                new Discord.ButtonBuilder()
                    .setLabel("Reject")
                    .setCustomId(`approval-form:BUTTON:moderation/reject-declare:${interaction.user.id}`)
                    .setStyle(Discord.ButtonStyle.Danger)
            )
        ]
    });
}