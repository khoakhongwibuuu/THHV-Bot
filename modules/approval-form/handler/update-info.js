const { memory, formLib } = global.customLib;

module.exports.exec = async (interaction) => {
    let userData = {
        guildId: interaction.guild.id,
        social: {
            Email: null,
            Codeforces: null,
            VNOI: null
        },
        rewards: {
            VOI: null,
            others: null
        },
        notes: null
    }

    const UUID = await memory.setData(userData, 1000 * 60 * 15);

    await formLib.addMemberToCache(interaction.guild.id, interaction.user.id);
    setTimeout(async () => {
        await formLib.removeMemberFromCache(interaction.guild.id, interaction.user.id);
    }, 1000 * 60 * 15);
    await interaction.user.send({
        content: "Đang khởi tạo form cập nhật."
    }).then(message => require('./BUTTON/update/display-page1.js').exec(interaction, UUID, message, true, false));
}
