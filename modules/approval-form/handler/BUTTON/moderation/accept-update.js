const Discord = require('discord.js');
const { formLib, discordAPI } = global.customLib;

module.exports.exec = async (interaction, clienMemberId) => {
    if (!discordAPI.isModerator(interaction.guild.id, interaction.user.id)) {
        interaction.reply({
            content: "🚫 You do not have permission to run this command.",
            ephemeral: true
        });
        return;
    }
    if (!formLib.isSetup(interaction.guild.id)) {
        await interaction.reply({
            ephemeral: true,
            content: `Đã có lỗi nghiêm trọng xảy ra.`
        });
        return;
    }

    await interaction.message.fetch();

    const sentEmbed = Discord.EmbedBuilder.from(interaction.message.embeds[0])
        .setColor(0x047e37)
        .setFooter({ text: `✅ Đã được duyệt` });

    sentEmbed.setDescription(
        sentEmbed.data.description
        + `\n* Người duyệt yêu cầu: <@${interaction.user.id}>`
        + `\n* Thời điểm duyệt yêu cầu: <t:${Math.floor(interaction.createdTimestamp / 1000)}:F>`
    );

    await interaction.message.edit({
        embeds: [sentEmbed],
        components: []
    });

    await interaction.reply({
        ephemeral: true,
        content: `Đã xác nhận yêu cầu của <@${clienMemberId}>.`
    });
}