const Discord = require('discord.js');
const { formLib, discordAPI } = global.customLib;

module.exports.exec = async (interaction, clienMembertId) => {
    if (!discordAPI.isModerator(interaction.guild.id, interaction.user.id)) {
        interaction.reply({
            content: "🚫 You do not have permission to run this command.",
            ephemeral: true
        });
        return;
    }
    if (formLib.isSetup(interaction.guild.id)) {
        await interaction.message.fetch();

        formLib.removeMemberFromApprovalQueue(interaction.guild.id, clienMembertId);
        formLib.removeMemberFromCache(interaction.guild.id, clienMembertId);

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
            content: `Đã từ chối yêu cầu của <@${clienMembertId}>.`
        });
    }
}