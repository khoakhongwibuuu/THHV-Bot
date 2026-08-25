const Discord = require('discord.js');
const formLib = require('#modules/approval-form/lib/formLib.js');
const discordAPI = require('#assets/api/discord.api.js');
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

    await formLib.removeMemberFromApprovalQueue(interaction.guild.id, clientMemberId);

    const sentEmbed = Discord.EmbedBuilder.from(interaction.message.embeds[0])
        .setColor(0xb42831)
        .setFooter({ text: `❌ Đã bị từ chối` });

    sentEmbed.setDescription(
        sentEmbed.data.description
        + `\n* Người từ chối yêu cầu: <@${interaction.user.id}>`
        + `\n* Thời điểm từ chối yêu cầu: <t:${Math.floor(interaction.createdTimestamp / 1000)}:F>`
    );

    await interaction.message.edit({
        embeds: [sentEmbed],
        components: []
    });

    await interaction.reply({
        ephemeral: true,
        content: `Đã từ chối yêu cầu của <@${clientMemberId}>.`
    });
}
