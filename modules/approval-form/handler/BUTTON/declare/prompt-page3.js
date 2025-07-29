const Discord = require('discord.js');
const { memory } = global.customLib;

module.exports.exec = async (interaction, UUID) => {
    const data = memory.getData(UUID);
    if (!data) {
        await interaction.reply({
            ephemeral: true,
            content: `Đã có lỗi xảy ra. Vui lòng huỷ yêu cầu thử khai báo lại.`
        });
        return;
    }

    const modal = new Discord.ModalBuilder()
        .setCustomId(`approval-form:MODAL:declare/reward:${UUID}`)
        .setTitle("Thông tin các giải thưởng")
        .addComponents(
            new Discord.ActionRowBuilder().addComponents(
                new Discord.TextInputBuilder()
                    .setCustomId("voi")
                    .setLabel("Các năm tham gia kì thi HSGQG")
                    .setStyle(Discord.TextInputStyle.Paragraph)
                    .setMinLength(1)
                    .setMaxLength(50)
                    .setRequired(false)
                    .setPlaceholder("Ví dụ: Tham gia học sinh giỏi quốc gia hai năm 2024, 2025 thì điền 24, 25.")
            ),
            new Discord.ActionRowBuilder().addComponents(
                new Discord.TextInputBuilder()
                    .setCustomId("others")
                    .setLabel("Các giải thưởng tin học khác")
                    .setStyle(Discord.TextInputStyle.Paragraph)
                    .setMinLength(1)
                    .setMaxLength(100)
                    .setRequired(false)
                    .setPlaceholder("Ví dụ: TST 2024, APIO 2025, ...")
            ),
            new Discord.ActionRowBuilder().addComponents(
                new Discord.TextInputBuilder()
                    .setCustomId("notes")
                    .setLabel("Ghi chú thêm")
                    .setStyle(Discord.TextInputStyle.Paragraph)
                    .setMinLength(1)
                    .setMaxLength(1000)
                    .setRequired(false)
            )
        )
    await interaction.showModal(modal);
}