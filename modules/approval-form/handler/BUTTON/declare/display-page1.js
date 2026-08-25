const Discord = require('discord.js');
const memory = require('#assets/api/memory.api.js');
const { client } = require('#assets/library/state.js');

module.exports.exec = async (interaction, UUID, message, firstTimeDisplay, pageRedirected, modalInteraction) => {
    if (!pageRedirected && pageRedirected !== false) pageRedirected = true;
    if (!message) message = interaction.message;

    const data = await memory.getData(UUID);
    if (!data) {
        await interaction.reply({
            ephemeral: true,
            content: `Đã có lỗi xảy ra. Vui lòng huỷ yêu cầu và thử khai báo lại.`
        });
        return;
    }

    let pg1_data = {
        content: "",
        embeds: [
            new Discord.EmbedBuilder()
                .setTitle("Form khai báo thông tin - Trang 1")
                .setDescription(
                    "**Trang đầu tiên, bạn sẽ khai báo 2 thông tin sau:**"
                    + "\n* Họ và tên"
                    + "\n* Khoá của bạn tại trường"

                    + "\n\n**Lưu ý:**"
                    + "\n* 2 thông tin này sẽ gắn liền với bạn và không thể thay đổi sau khi khai báo."
                    + "\n* Nếu năm học lớp 10 của bạn là 2025-2026 thì khoá của bạn là 30, 2026-2027 là khoá 31. Các khoá trước và sau đó được tính tương tự."

                )
                .setFooter({
                    text: "Trang 1/3: Thông tin cơ bản",
                    iconURL: client.user.avatarURL()
                })
                .addFields(
                    {
                        name: "**Họ và tên**",
                        value: data.basic.fullName
                            ? data.basic.fullName.codeChunk()
                            : "Chưa có",
                        inline: true
                    },
                    {
                        name: "**Khoá của bạn tại trường**",
                        value: data.basic.schoolYear
                            ? data.basic.schoolYear.codeChunk()
                            : "Chưa có",
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
                    .setCustomId(`approval-form:BUTTON:declare/prompt-page1:${UUID}`)
                    .setStyle(Discord.ButtonStyle.Secondary)
                    .setDisabled(false)
                ,
                new Discord.ButtonBuilder()
                    .setLabel("Trang sau")
                    .setCustomId(`approval-form:BUTTON:declare/display-page2:${UUID}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setDisabled(false)
            )
        ]
    }

    await message.edit(pg1_data).then(msg => {
        if (firstTimeDisplay) {
            interaction.editReply({
                ephemeral: true,
                content: `[Form khai báo](https://discord.com/channels/@me/${msg.channel.id}/${msg.id}) đã được gửi tới DM của bạn.`
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
