const memory = require('#assets/api/memory.api.js');

module.exports.exec = async (interaction, UUID) => {
    const verifiedRoleId = interaction.values[0];
    const wizardSession = await memory.getData(UUID);
    if (wizardSession) {
        wizardSession.embed.fields[2].value = `<@&${verifiedRoleId}>`;
        wizardSession.data.role = verifiedRoleId;

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

        await memory.modifyData(UUID, wizardSession);

        await interaction.reply({
            content: `Đã đổi Role xác thực thành <@&${verifiedRoleId}>`,
            ephemeral: true
        }).then(message => setTimeout(() => message.delete(), 1000));
    } else {
        await interaction.reply({
            content: "Found invalid data. Please re-use command again.",
            ephemeral: true
        });
    }
}
