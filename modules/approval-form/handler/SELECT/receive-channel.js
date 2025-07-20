const { memory } = global.customLib;

module.exports.exec = async (interaction, UUID) => {
    const verifiedRChannelId = interaction.values[0];
    const wizardSession = memory.getData(UUID);
    if (wizardSession) {
        wizardSession.embed.fields[1].value = `<#${verifiedRChannelId}>`;
        wizardSession.data.receive = verifiedRChannelId;

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
            content: `Đã đổi Kênh nhận yêu cầu xác thực thành <#${verifiedRChannelId}>`,
            ephemeral: true
        }).then(message => setTimeout(() => message.delete(), 1000));
    } else {
        await interaction.reply({
            content: "Found invalid data. Please re-use command again.",
            ephemeral: true
        });
    }
}