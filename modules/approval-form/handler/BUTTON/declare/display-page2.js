const Discord = require('discord.js');
const { memory } = global.customLib;
const { client } = global.variable;

module.exports.exec = async (interaction, UUID, message, pageRedirected, modalInteraction) => {
    if (!pageRedirected && pageRedirected !== false) pageRedirected = true;
    if (!message) message = interaction.message;
    const data = memory.getData(UUID);
    if (data) {
        let pg2_data = {
            content: "",
            embeds: [
                new Discord.EmbedBuilder()
                    .setTitle("Form khai báo thông tin - Trang 2")
                    .setDescription(
                        "**Ở trang này, bạn sẽ khai báo các thông tin sau:**"
                        + "\n* Địa chỉ Email của bạn"
                        + "\n* Username tài khoản của bạn trên nền tảng [Codeforces](https://codeforces.com/)"
                        + "\n* Username tài khoản của bạn trên nền tảng [VNOI Online Judge](https://oj.vnoi.info/)"

                        + "\n\n**Lưu ý:**"
                        + "\n* Các tài khoản trên các nền tảng trên là bắt buộc."
                    )
                    .setFooter({
                        text: "Trang 2/3: Thông tin liên hệ, các tài khoản lập trình thi đấu",
                        iconURL: client.user.avatarURL()
                    })
                    .addFields(
                        {
                            name: "**Địa chỉ Email**",
                            value: (data.social.Email ? `\`\`\`${data.social.Email}\`\`\`` : "Chưa có"),
                        },
                        {
                            name: "**Codeforces handle**",
                            value: (data.social.Codeforces ? `\`\`\`${data.social.Codeforces}\`\`\`` : "Chưa có"),
                            inline: true
                        },
                        {
                            name: "**VNOI OJ username**",
                            value: (data.social.VNOI ? `\`\`\`${data.social.VNOI}\`\`\`` : "Chưa có"),
                            inline: true
                        }
                    )
            ],
            components: [
                new Discord.ActionRowBuilder().addComponents(
                    new Discord.ButtonBuilder()
                        .setLabel("Huỷ yêu cầu")
                        .setCustomId(`approval-form:BUTTON:declare/cancel:${UUID}`)
                        .setStyle(Discord.ButtonStyle.Danger)
                    ,
                    new Discord.ButtonBuilder()
                        .setLabel("Trang trước")
                        .setCustomId(`approval-form:BUTTON:declare/display-page1:${UUID}`)
                        .setStyle(Discord.ButtonStyle.Primary)
                        .setDisabled(false)
                    ,
                    new Discord.ButtonBuilder()
                        .setLabel("Nhập thông tin")
                        .setCustomId(`approval-form:BUTTON:declare/prompt-page2:${UUID}`)
                        .setStyle(Discord.ButtonStyle.Secondary)
                        .setDisabled(false)
                    ,
                    new Discord.ButtonBuilder()
                        .setLabel("Trang sau")
                        .setCustomId(`approval-form:BUTTON:declare/display-page3:${UUID}`)
                        .setStyle(Discord.ButtonStyle.Primary)
                        .setDisabled(false)
                    ,
                    // new Discord.ButtonBuilder()
                    //     .setLabel("Gửi yêu cầu")
                    //     .setCustomId(`approval-form:BUTTON:declare/submit:${UUID}`)
                    //     .setStyle(Discord.ButtonStyle.Success)
                    //     .setDisabled(true)
                    // ,
                )
            ]
        }

        await message.edit(pg2_data).then(msg => {
            if (pageRedirected) {
                if (interaction.replied || interaction.deferred) {
                    interaction.followUp({ content: 'Đang hiển thị trang 2', ephemeral: true });
                } else {
                    interaction.reply({ content: 'Đang hiển thị trang 2', ephemeral: true });
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
}