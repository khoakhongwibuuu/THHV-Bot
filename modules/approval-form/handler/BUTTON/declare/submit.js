const Discord = require('discord.js');
const { memory, formLib, discordAPI } = global.customLib;

module.exports.exec = async (interaction, UUID) => {
    const data = memory.getData(UUID);
    if (data && formLib.isSetup(data.guildId)) {
        memory.deleteData(UUID);
        formLib.addMemberToApprovalQueue(data.guildId, interaction.user.id);

        await interaction.reply({
            ephemeral: true,
            content: "Đã gửi yêu cầu khai báo đến các Moderator/Admin Tin học Hùng Vương."
        });

        await discordAPI.GuildChannel(data.guildId, formLib.getGuildConfig(data.guildId).receive).send({
            embeds: [
                new Discord.EmbedBuilder()
                    .setFooter({
                        text: `🕒 Đang chờ xác thực-${interaction.user.id}`
                    })
                    .setTitle("Yêu cầu khai báo thành viên")
                    .setDescription(
                        `* Người tạo yêu cầu:  <@${interaction.user.id}>`
                        + `\n* Thời điểm tạo yêu cầu: <t:${Math.floor(interaction.createdTimestamp / 1000)}:F>`
                    )
                    .addFields(
                        {
                            name: "**Họ và tên**",
                            value: `\`\`\`${data.basic.fullName}\`\`\``,
                            inline: true
                        },
                        {
                            name: "**Khoá**",
                            value: `\`\`\`${data.basic.schoolYear}\`\`\``,
                            inline: true
                        },
                        {
                            name: "**Địa chỉ Email**",
                            value: `\`\`\`${data.social.Email}\`\`\``,
                            inline: false
                        },
                        {
                            name: "**Codeforces**",
                            value: `\`\`\`${data.social.Codeforces}\`\`\``,
                            inline: true
                        },
                        {
                            name: "**VNOI OJ**",
                            value: `\`\`\`${data.social.VNOI}\`\`\``,
                            inline: true
                        },
                        {
                            name: "**Các năm tham gia kì thi HSGQG**",
                            value: `\`\`\`${data.rewards.VOI ? data.rewards.VOI : "Không có"}\`\`\``,
                            inline: false
                        },
                        {
                            name: "**Các giải thưởng tin học khác**",
                            value: `\`\`\`${data.rewards.others ? data.rewards.others : "Không có"}\`\`\``,
                            inline: false
                        },
                        {
                            name: "**Ghi chú thêm**",
                            value: `\`\`\`${data.notes ? data.notes : "Không có"}\`\`\``,
                            inline: false
                        },
                    )
            ],
            components: [
                new Discord.ActionRowBuilder().addComponents(
                    new Discord.ButtonBuilder()
                        .setLabel("Accept")
                        .setCustomId(`approval-form:BUTTON:moderation/accept-declare:${0}`)
                        .setStyle(Discord.ButtonStyle.Success)
                    ,
                    new Discord.ButtonBuilder()
                        .setLabel("Reject")
                        .setCustomId(`approval-form:BUTTON:moderation/reject-declare:${0}`)
                        .setStyle(Discord.ButtonStyle.Danger)
                )
            ]
        });


        interaction.message.delete();
    }
}