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

    if (!data.host) {
        memory.modifyData(UUID, {
            ...data,
            host: interaction
        });
    }

    const modal = new Discord.ModalBuilder()
        .setCustomId(`approval-form:MODAL:update/social:${UUID}`)
        .setTitle("Thông tin liên hệ, các tài khoản")
        .addComponents(
            new Discord.ActionRowBuilder().addComponents(
                new Discord.TextInputBuilder()
                    .setCustomId("email")
                    .setLabel("Địa chỉ email")
                    .setStyle(Discord.TextInputStyle.Paragraph)
                    .setMinLength(1)
                    .setMaxLength(200)
                    .setRequired(false)
                    .setPlaceholder("Ví dụ: example@gmail.com, example2@gmail.com")
            ),
            new Discord.ActionRowBuilder().addComponents(
                new Discord.TextInputBuilder()
                    .setCustomId("codeforces")
                    .setLabel("Codeforces handle")
                    .setStyle(Discord.TextInputStyle.Paragraph)
                    .setMinLength(1)
                    .setMaxLength(100)
                    .setRequired(false)
                    .setPlaceholder("Ví dụ: aliceAndBob, Addbeefbob")
            ),
            new Discord.ActionRowBuilder().addComponents(
                new Discord.TextInputBuilder()
                    .setCustomId("vnoi")
                    .setLabel("VNOI username")
                    .setStyle(Discord.TextInputStyle.Paragraph)
                    .setMinLength(1)
                    .setMaxLength(100)
                    .setRequired(false)
                    .setPlaceholder("Ví dụ: aliceAndBob, Addbeefbob")
            )
        )
    await interaction.showModal(modal);
}