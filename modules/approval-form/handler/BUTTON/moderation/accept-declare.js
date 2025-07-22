const Discord = require('discord.js');
const { formLib, discordAPI } = global.customLib;

module.exports.exec = async (interaction) => {
    if (!discordAPI.isModerator(interaction.guild.id, interaction.user.id)) {
        interaction.reply({
            content: "🚫 You do not have permission to run this command.",
            ephemeral: true
        });
        return;
    }
    if (formLib.isSetup(interaction.guild.id)) {
        await interaction.message.fetch();

        const footerText = interaction.message.embeds[0].footer.text;
        const clienMembertId = footerText.slice(footerText.lastIndexOf('-') + 1);
        formLib.removeMemberFromApprovalQueue(interaction.guild.id, clienMembertId);
        formLib.removeMemberFromCache(interaction.guild.id, clienMembertId);

        const clientMember = discordAPI.GuildMember(
            interaction.guild.id,
            clienMembertId
        );
        const verifyRole = discordAPI.GuildRole(
            interaction.guild.id,
            formLib.getGuildConfig(interaction.guild.id).role
        );

        clientMember.roles.add(verifyRole);

        const sentEmbed = Discord.EmbedBuilder.from(interaction.message.embeds[0])
            .setColor(0x047e37)
            .setFooter({ text: `✅ Đã được duyệt` });

        sentEmbed.setDescription(
            sentEmbed.data.description
            + `\n* Người duyệt yêu cầu: <@${interaction.user.id}>`
            + `\n* Thời điểm duyệt yêu cầu: <@${interaction.createdTimestamp}>`
        );

        await interaction.message.edit({
            embeds: [sentEmbed],
            components: []
        });

        await interaction.reply({
            ephemeral: true,
            content: "Done."
        });
    }
}