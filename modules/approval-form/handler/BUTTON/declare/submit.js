const Discord = require('discord.js');
const memory = require('#assets/api/memory.api.js');
const formLib = require('#modules/approval-form/lib/formLib.js');
const discordAPI = require('#assets/api/discord.api.js');
const discordAPIv2 = require('#assets/api/discord.api.v2.js');

module.exports.exec = async (interaction, UUID) => {
    const data = await memory.getData(UUID);
    if (!data) {
        await interaction.reply({
            ephemeral: true,
            content: `Đã có lỗi xảy ra. Vui lòng huỷ yêu cầu và thử khai báo lại.`
        });
        return;
    }
    if (!await formLib.isSetup(data.guildId)) {
        await interaction.reply({
            ephemeral: true,
            content: `Đã có lỗi nghiêm trọng xảy ra.`
        });
        return;
    }

    await memory.deleteData(UUID);

    await formLib.removeMemberFromCache(data.guildId, interaction.user.id);
    await formLib.addMemberToApprovalQueue(data.guildId, interaction.user.id);

    await interaction.reply({
        ephemeral: true,
        content: "Đã gửi yêu cầu khai báo đến các Moderator/Admin Tin học Hùng Vương."
    });

    await interaction.message.delete();

    const { fullName, schoolYear } = data.basic;
    const { Email, Codeforces, VNOI } = data.social;
    const { VOI, others } = data.rewards;
    const { notes } = data;

    const broadcastChannel = await discordAPIv2.GuildChannel(data.guildId, (await formLib.getGuildConfig(data.guildId)).receive);

    // await discordAPI.GuildChannel(data.guildId, (await formLib.getGuildConfig(data.guildId)).receive).send({
    await broadcastChannel.send({
        embeds: [
            new Discord.EmbedBuilder()
                .setFooter({
                    text: `🕒 Đang chờ duyệt`
                })
                .setTitle("Yêu cầu khai báo thông tin thành viên")
                .setDescription(
                    `* Người tạo yêu cầu: <@${interaction.user.id}> `
                    + `\n* Thời điểm tạo yêu cầu: <t:${Math.floor(interaction.createdTimestamp / 1000)}:F>`
                )
                .addFields(
                    {
                        name: "**Họ và tên**",
                        value: fullName.codeChunk().hidden(),
                        inline: false
                    },
                    {
                        name: "**Codeforces**",
                        value: Codeforces.tokenise().linkListing("https://codeforces.com/profile/", ", "),
                        inline: true
                    },
                    {
                        name: "**VNOI OJ**",
                        value: VNOI.tokenise().linkListing("https://oj.vnoi.info/user/", ", "),
                        inline: true
                    },
                    {
                        name: "**Khoá**",
                        value: `K${schoolYear}`.codeChunk(),
                        inline: false
                    },
                    {
                        name: "**Các năm tham gia kì thi HSGQG**",
                        value: VOI
                            ? VOI.tokenise().listing("", "", ", ").codeChunk()
                            : "Không có",
                        inline: false
                    },
                    {
                        name: "**Địa chỉ Email**",
                        value: Email.tokenise().listing("", "", ", ").codeChunk().hidden(),
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
                            : "Không có",
                        inline: false
                    },
                    {
                        name: "**Ghi chú thêm**",
                        value: notes
                            ? notes.codeChunk()
                            : "Không có",
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
