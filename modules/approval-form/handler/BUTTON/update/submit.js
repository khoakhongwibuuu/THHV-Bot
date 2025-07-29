const Discord = require('discord.js');
const { memory, formLib, discordAPI } = global.customLib;

module.exports.exec = async (interaction, UUID) => {
    const data = memory.getData(UUID);
    if (!data) {
        await interaction.reply({
            ephemeral: true,
            content: `Đã có lỗi xảy ra. Vui lòng huỷ yêu cầu và thử cập nhật lại.`
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
    formLib.removeMemberFromCache(data.guildId, interaction.user.id);

    await interaction.reply({
        ephemeral: true,
        content: "Đã gửi yêu cầu cập nhật đến các Moderator/Admin Tin học Hùng Vương."
    });

    await interaction.message.delete();

    const { Email, Codeforces, VNOI } = data.social;
    const { VOI, others } = data.rewards;
    const { notes } = data;

    await discordAPI.GuildChannel(data.guildId, formLib.getGuildConfig(data.guildId).receive).send({
        embeds: [
            new Discord.EmbedBuilder()
                .setFooter({
                    text: `🕒 Đang chờ duyệt`
                })
                .setTitle("Yêu cầu cập nhật thông tin thành viên")
                .setDescription(
                    `* Người tạo yêu cầu: <@${interaction.user.id}> `
                    + `\n * Thời điểm tạo yêu cầu: <t:${Math.floor(interaction.createdTimestamp / 1000)}:F>`
                )
                .addFields(
                    {
                        name: "**Địa chỉ Email**",
                        value: Email
                            ? Email.tokenise().listing("", "", "\n").codeChunk().hidden()
                            : "Không thay đổi",
                        inline: false
                    },
                    {
                        name: "**Codeforces**",
                        value: Codeforces
                            ? Codeforces.tokenise().linkListing("https://codeforces.com/profile/", "\n")
                            : "Không thay đổi",
                        inline: true
                    },
                    {
                        name: "**VNOI OJ**",
                        value: VNOI
                            ? VNOI.tokenise().linkListing("https://oj.vnoi.info/user/", "\n")
                            : "Không thay đổi",
                        inline: true
                    },
                    {
                        name: "**Các năm tham gia kì thi HSGQG**",
                        value: VOI
                            ? VOI.tokenise().listing("", "", "\n").codeChunk()
                            : "Không thay đổi",
                        inline: false
                    },
                    {
                        name: "**Các giải thưởng tin học khác**",
                        value: others
                            ? others.tokenise().listing("", "", "\n").codeChunk()
                            : "Không thay đổi",
                        inline: false
                    },
                    {
                        name: "**Ghi chú thêm**",
                        value: data.notes
                            ? notes.codeChunk()
                            : "Không thay đổi",
                        inline: false
                    },
                )
        ],
        components: [
            new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder()
                    .setLabel("Accept")
                    .setCustomId(`approval-form:BUTTON:moderation/accept-update:${interaction.user.id}`)
                    .setStyle(Discord.ButtonStyle.Success)
                ,
                new Discord.ButtonBuilder()
                    .setLabel("Reject")
                    .setCustomId(`approval-form:BUTTON:moderation/reject-update:${interaction.user.id}`)
                    .setStyle(Discord.ButtonStyle.Danger)
            )
        ]
    });
}