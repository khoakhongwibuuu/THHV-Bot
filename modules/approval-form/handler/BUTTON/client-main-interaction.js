const { formLib } = global.customLib;

module.exports.exec = async (interaction) => {
    if (!formLib.isSetup(interaction.guild.id)) {
        interaction.reply({
            ephemeral: true,
            content: "This server Approval form profile has been uninstalled before."
                + "\nYou cannot start an approval request."
        });
        return;
    }
    if (!formLib.memberIsVerified(interaction.guild.id, interaction.user.id)) {
        if (formLib.memberIsInApprovalQueue(interaction.guild.id, interaction.user.id))
            await interaction.reply({
                ephemeral: true,
                content: "Bạn đang có một yêu cầu đang chờ xác thực."
            });
        else if (formLib.memberIsInCache(interaction.guild.id, interaction.user.id))
            await interaction.reply({
                ephemeral: true,
                content: "Bạn đã tạo một yêu cầu trước đó."
            });
        else {
            await require('./../declare-info').exec(interaction);
        }
    } else {
        if (formLib.memberIsInCache(interaction.guild.id, interaction.user.id))
            await interaction.reply({
                ephemeral: true,
                content: "Bạn đã tạo một yêu cầu trước đó."
            });
        else
            await require('./../update-info.js').exec(interaction);
    }
}

