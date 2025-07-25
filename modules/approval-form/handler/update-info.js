const { memory, formLib } = global.customLib;

module.exports.exec = async (interaction) => {
    await interaction.reply({
        ephemeral: true,
        content: "Tính năng cập nhật thông tin cho các thành viên đã xác thực đang trong quá trình phát triển."
    });
}
