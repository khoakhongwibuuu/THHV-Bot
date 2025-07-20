const Discord = require('discord.js');
const { memory } = global.customLib;

module.exports.exec = async (interaction, UUID) => {
    const data = memory.getData(UUID);
    if (data) {
        const modal = new Discord.ModalBuilder()
            .setCustomId(`approval-form:MODAL:declare/social:${UUID}`)
            .setTitle("Thông tin liên hệ, các tài khoản")
            .addComponents(
                new Discord.ActionRowBuilder().addComponents(
                    new Discord.TextInputBuilder()
                        .setCustomId("email")
                        .setLabel("Địa chỉ email")
                        .setStyle(Discord.TextInputStyle.Paragraph)
                        .setMinLength(1)
                        .setRequired(true)
                        .setPlaceholder("Nếu có nhiều Email, hãy điền tất cả.")
                ),
                new Discord.ActionRowBuilder().addComponents(
                    new Discord.TextInputBuilder()
                        .setCustomId("codeforces")
                        .setLabel("Codeforces handle")
                        .setStyle(Discord.TextInputStyle.Paragraph)
                        .setMinLength(1)
                        .setRequired(true)
                        .setPlaceholder("Nếu có nhiều tài khoản, hãy điền tất cả.")
                ),
                new Discord.ActionRowBuilder().addComponents(
                    new Discord.TextInputBuilder()
                        .setCustomId("vnoi")
                        .setLabel("VNOI username")
                        .setStyle(Discord.TextInputStyle.Paragraph)
                        .setMinLength(1)
                        .setRequired(true)
                        .setPlaceholder("Nếu có nhiều tài khoản, hãy điền tất cả.")
                )
            )
        await interaction.showModal(modal);
    }
}