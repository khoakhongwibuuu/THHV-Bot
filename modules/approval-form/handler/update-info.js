const { memory, formLib } = global.customLib;

module.exports.exec = async (interaction) => {
    interaction.reply({
        ephemeral: true,
        content: "Tính cập nhật thông tin cho các thành viên đã xác thực đang trong quá trình phát triển."
    });
}
