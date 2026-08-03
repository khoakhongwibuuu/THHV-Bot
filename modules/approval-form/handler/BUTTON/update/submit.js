const Discord = require('discord.js');
const { memory, formLib, discordAPI, discordAPIv2 } = global.customLib;

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

    const broadcastChannel = await discordAPIv2.GuildChannel(data.guildId, formLib.getGuildConfig(data.guildId).receive);

    await broadcastChannel.send({
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
                        name: "**Codeforces**",
                        value: Codeforces
                            ? Codeforces.tokenise().linkListing("https://codeforces.com/profile/", ", ")
                            : "Không thay đổi",
                        inline: true
                    },
                    {
                        name: "**VNOI OJ**",
                        value: VNOI
                            ? VNOI.tokenise().linkListing("https://oj.vnoi.info/user/", ", ")
                            : "Không thay đổi",
                        inline: true
                    },
                    {
                        name: "**Các năm tham gia kì thi HSGQG**",
                        value: VOI
                            ? VOI.tokenise().listing("", "", ", ").codeChunk()
                            : "Không thay đổi",
                        inline: false
                    },
                    {
                        name: "**Địa chỉ Email**",
                        value: Email
                            ? Email.tokenise().listing("", "", ", ").codeChunk().hidden()
                            : "Không thay đổi",
                        inline: false
                    },
                    {
                        name: "**Discord username**",
                        value: interaction.user.username.codeChunk().hidden(),
                        inline: false
                    },
                    {
                        name: "**Discord identifier**",
                        value: interaction.user.id.codeChunk().hidden(),
                        inline: false
                    },
                    {
                        name: "**Các giải thưởng tin học khác**",
                        value: others
                            ? others.tokeniseV2().noSpaceListing("", "", "\n").codeChunk()
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