const Discord = require('discord.js');
const { memory } = global.customLib;

module.exports.exec = async (interaction, UUID) => {
    const data = await memory.getData(UUID);
    if (!data) {
        await interaction.reply({
            ephemeral: true,
            content: `Đã có lỗi xảy ra. Vui lòng huỷ yêu cầu thử khai báo lại.`
        });
        return;
    }

    if (!data.host) {
        await memory.modifyData(UUID, {
            ...data,
            host: interaction
        });
    }

    const modal = new Discord.ModalBuilder()
        .setCustomId(`approval-form:MODAL:declare/basic:${UUID}`)
        .setTitle("Thông tin cơ bản")
        .addComponents(
            new Discord.ActionRowBuilder().addComponents(
                new Discord.TextInputBuilder()
                    .setCustomId("fullName")
                    .setLabel("Họ và tên")
                    .setStyle(Discord.TextInputStyle.Short)
                    .setMinLength(1)
                    .setMaxLength(20)
                    .setRequired(true)
            ),
            new Discord.ActionRowBuilder().addComponents(
                new Discord.TextInputBuilder()
                    .setCustomId("schoolYear")
                    .setLabel("Khoá")
                    .setStyle(Discord.TextInputStyle.Short)
                    .setMinLength(1)
                    .setMaxLength(2)
                    .setRequired(true)
            )
        )
    await interaction.showModal(modal);
}
