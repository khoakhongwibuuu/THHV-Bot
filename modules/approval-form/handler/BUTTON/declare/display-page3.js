const Discord = require('discord.js');
const { memory } = global.customLib;
const { client } = global.variable;

const isSubmitLocked = (data) => {
    return !data.basic.fullName
        || !data.basic.schoolYear
        || !data.social.Email
        || !data.social.Codeforces
        || !data.social.VNOI;
}

module.exports.exec = async (interaction, UUID, message, pageRedirected, modalInteraction) => {
    if (!pageRedirected && pageRedirected !== false) pageRedirected = true;
    if (!message) message = interaction.message;

    const data = memory.getData(UUID);
    if (!data) {
        await interaction.reply({
            ephemeral: true,
            content: `Đã có lỗi xảy ra. Vui lòng huỷ yêu cầu và thử khai báo lại.`
        });
        return;
    }

    let pg3_data = {
        content: "",
        embeds: [
            new Discord.EmbedBuilder()
                .setTitle("Form khai báo thông tin - Trang 3")
                .setDescription(
                    "**Trang cuối cùng dùng để khai báo các thành tích môn tin học bạn đã có. Gồm:**"
                    + "\n* Các năm học bạn đã tham gia kì thi Học sinh giỏi quốc gia nếu có"
                    + "\n* Các giải thưởng tin học khác nếu có"

                    + "\n\n**Lưu ý:**"
                    + "\n* Các thông tin bên dưới là không bắt buộc."
                    + "\n* Nếu bạn không có bất kì thành tích nào thì có thể bỏ qua trang này và bấm `Gửi yêu cầu`."
                )
                .setFooter({
                    text: "Trang 3/3: Thông tin các giải thưởng",
                    iconURL: client.user.avatarURL()
                })
                .addFields(
                    {
                        name: "**Các năm tham gia kì thi Học sinh giỏi quốc gia nếu có**",
                        value: data.rewards.VOI
                            ? data.rewards.VOI.codeChunk()
                            : "Không có",
                    },
                    {
                        name: "**Các giải thưởng tin học khác (ví dụ: TST, ICPC, APIO, IOI, ...) và năm đạt giải nếu có**",
                        value: data.rewards.others
                            ? data.rewards.others.codeChunk()
                            : "Không có",
                    },
                    {
                        name: "**Ghi chú thêm nếu có**",
                        value: data.notes
                            ? data.notes.codeChunk()
                            : "Không có",
                    }
                )
        ],
        components: [
            new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder()
                    .setLabel("Huỷ yêu cầu")
                    .setCustomId(`approval-form:BUTTON:cancel:${UUID}`)
                    .setStyle(Discord.ButtonStyle.Danger)
                ,
                new Discord.ButtonBuilder()
                    .setLabel("Trang trước")
                    .setCustomId(`approval-form:BUTTON:declare/display-page2:${UUID}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setDisabled(false)
                ,
                new Discord.ButtonBuilder()
                    .setLabel("Nhập thông tin")
                    .setCustomId(`approval-form:BUTTON:declare/prompt-page3:${UUID}`)
                    .setStyle(Discord.ButtonStyle.Secondary)
                    .setDisabled(false)
                ,
                new Discord.ButtonBuilder()
                    .setLabel("Gửi yêu cầu")
                    .setCustomId(`approval-form:BUTTON:declare/submit:${UUID}`)
                    .setStyle(Discord.ButtonStyle.Success)
                    .setDisabled(isSubmitLocked(data))
            )
        ]
    }

    await message.edit(pg3_data).then(msg => {
        if (pageRedirected) {
            if (interaction.replied || interaction.deferred) {
                interaction.followUp({ content: 'Đang hiển thị trang 3', ephemeral: true });
            } else {
                interaction.reply({ content: 'Đang hiển thị trang 3', ephemeral: true });
            }
        } else {
            if (modalInteraction) {
                if (modalInteraction.replied || modalInteraction.deferred) {
                    modalInteraction.followUp({ content: 'Đã cập nhật', ephemeral: true });
                } else {
                    modalInteraction.reply({ content: 'Đã cập nhật', ephemeral: true });
                }
            }
        }
    });
}