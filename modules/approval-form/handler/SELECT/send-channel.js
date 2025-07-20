const { memory } = global.customLib;

module.exports.exec = async (interaction, UUID) => {
    const verifiedSChannelId = interaction.values[0];
    const wizardSession = memory.getData(UUID);
    if (wizardSession) {
        wizardSession.embed.fields[0].value = `<#${verifiedSChannelId}>`;
        wizardSession.data.send = verifiedSChannelId;

        await interaction.message.fetch();

        if (wizardSession.data.role && wizardSession.data.send && wizardSession.data.receive) {
            await interaction.message.edit({
                embeds: [wizardSession.embed],
                components: wizardSession.components.filter((_, index) => index !== 3)
            });
        } else {
            await interaction.message.edit({
                embeds: [wizardSession.embed]
            });
        }

        memory.modifyData(UUID, wizardSession);

        await interaction.reply({
            content: `Đã đổi Kênh gửi yêu cầu xác thực thành <#${verifiedSChannelId}>`,
            ephemeral: true
        }).then(message => setTimeout(() => message.delete(), 1000));
    } else {
        await interaction.reply({
            content: "Found invalid data. Please re-use command again.",
            ephemeral: true
        });
    }
}