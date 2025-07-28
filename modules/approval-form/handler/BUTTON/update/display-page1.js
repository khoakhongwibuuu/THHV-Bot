const Discord = require('discord.js');
const { memory } = global.customLib;
const { client } = global.variable;

module.exports.exec = async (interaction, UUID, message, firstTimeDisplay, pageRedirected, modalInteraction) => {
    if (!pageRedirected && pageRedirected !== false) pageRedirected = true;
    if (!message) message = interaction.message;

    const data = memory.getData(UUID);
    if (!data) {
        await interaction.reply({
            ephemeral: true,
            content: `Đã có lỗi xảy ra. Vui lòng huỷ yêu cầu và thử lại.`
        });
        return;
    }

    let pg1_data = {
        content: "",
        embeds: [
            new Discord.EmbedBuilder()
                .setTitle("Form cập nhật thông tin - Trang 1")
                .setDescription(
                    "**Ở trang này, bạn sẽ cập nhật các thông tin sau nếu có thay đổi:**"
                    + "\n* Địa chỉ Email của bạn"
                    + "\n* Handle tài khoản của bạn trên nền tảng [Codeforces](https://codeforces.com/)"
                    + "\n* Username tài khoản của bạn trên nền tảng [VNOI Online Judge](https://oj.vnoi.info/)"

                    + "\n\n**Lưu ý:**"
                    + "\n* Các tài khoản trên các nền tảng trên là bắt buộc."
                    + "\n* Username/Handle các tài khoản có phân biệt CHỮ HOA, chữ thường."
                    + "\n* Nếu có nhiều Email/Tài khoản, hãy điền tất cả cách nhau bởi dấu phẩy và dấu cách."
                )
                .setFooter({
                    text: "Trang 1/2: Thông tin liên hệ, các tài khoản lập trình thi đấu",
                    iconURL: client.user.avatarURL()
                })
                .addFields(
                    {
                        name: "**Địa chỉ Email**",
                        value: (data.social.Email ? `\`\`\`${data.social.Email}\`\`\`` : "Không thay đổi"),
                    },
                    {
                        name: "**Codeforces handle**",
                        value: (data.social.Codeforces ? `\`\`\`${data.social.Codeforces}\`\`\`` : "Không thay đổi"),
                        inline: true
                    },
                    {
                        name: "**VNOI OJ username**",
                        value: (data.social.VNOI ? `\`\`\`${data.social.VNOI}\`\`\`` : "Không thay đổi"),
                        inline: true
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
                    .setLabel("Nhập thông tin")
                    .setCustomId(`approval-form:BUTTON:update/prompt-page1:${UUID}`)
                    .setStyle(Discord.ButtonStyle.Secondary)
                    .setDisabled(false)
                ,
                new Discord.ButtonBuilder()
                    .setLabel("Trang sau")
                    .setCustomId(`approval-form:BUTTON:update/display-page2:${UUID}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setDisabled(false)
            )
        ]
    }

    await message.edit(pg1_data).then(msg => {
        if (firstTimeDisplay) {
            interaction.reply({
                ephemeral: true,
                content: `[Form cập nhật](https://discord.com/channels/@me/${msg.channel.id}/${msg.id}) đã được gửi tới DM của bạn.`
            })
        } else {
            if (pageRedirected) {
                if (interaction.replied || interaction.deferred) {
                    interaction.followUp({ content: 'Đang hiển thị trang 1', ephemeral: true });
                } else {
                    interaction.reply({ content: 'Đang hiển thị trang 1', ephemeral: true });
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
        }
    });
}