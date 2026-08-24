const { formLib } = global.customLib;

module.exports.exec = async (interaction) => {
    if (!await formLib.isSetup(interaction.guild.id)) {
        interaction.reply({
            ephemeral: true,
            content: "This server Approval form profile has been uninstalled before."
                + "\nYou cannot start an approval request."
        });
        return;
    }

    await interaction.deferReply({ ephemeral: true });

    const isMemberVerified = await formLib.memberIsVerified(interaction.guild.id, interaction.user.id);
    if (!isMemberVerified) {
        if (await formLib.memberIsInApprovalQueue(interaction.guild.id, interaction.user.id))
            await interaction.editReply({
                ephemeral: true,
                content: "Bạn đang có một yêu cầu đang chờ xác thực."
            });
        else if (await formLib.memberIsInCache(interaction.guild.id, interaction.user.id))
            await interaction.editReply({
                ephemeral: true,
                content: "Bạn đã tạo một yêu cầu trước đó."
            });
        else {
            await require('./../declare-info').exec(interaction);
        }
    } else {
        if (await formLib.memberIsInCache(interaction.guild.id, interaction.user.id))
            await interaction.editReply({
                ephemeral: true,
                content: "Bạn đã tạo một yêu cầu trước đó."
            });
        else {
            await require('./../update-info.js').exec(interaction);
        }
    }
}

