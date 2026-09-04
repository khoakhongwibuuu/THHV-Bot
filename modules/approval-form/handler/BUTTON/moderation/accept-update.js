const Discord = require('discord.js');
const formLib = require('#modules/approval-form/lib/formLib.js');
const discordAPIv2 = require('#assets/api/discord.api.v2.js');

module.exports.exec = async (interaction, clientMemberId) => {
    const isMod = await discordAPIv2.isModerator(interaction.guild.id, interaction.user.id);
    // if (!discordAPI.isModerator(interaction.guild.id, interaction.user.id)) {
    if (!isMod) {
        interaction.reply({
            content: "🚫 You do not have permission to run this command.",
            ephemeral: true
        });
        return;
    }
    if (!await formLib.isSetup(interaction.guild.id)) {
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
        content: `Đã duyệt yêu cầu của <@${clientMemberId}>.`
    });
}
