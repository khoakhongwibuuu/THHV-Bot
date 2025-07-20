const Discord = require('discord.js');
const { memory, formLib, discordAPI } = global.customLib;

module.exports.exec = async (interaction) => {
    if (!discordAPI.isModerator(interaction.guild.id, interaction.user.id)) {
        interaction.reply({
            content: "🚫 You do not have permission to run this command.",
            ephemeral: true
        });
        return;
    }
    if (formLib.isSetup(interaction.guild.id)) {
        interaction.message.fetch();

        const footerText = interaction.message.embeds[0].footer.text;
        const clienMembertId = footerText.slice(footerText.lastIndexOf('-') + 1);
        formLib.removeMemberFromApprovalQueue(interaction.guild.id, clienMembertId);
        formLib.removeMemberFromCache(interaction.guild.id, clienMembertId);

        const sentEmbed = Discord.EmbedBuilder.from(interaction.message.embeds[0])
            .setColor(0xb42831)
            .setFooter({ text: `❌ Đã bị từ chối bởi ${interaction.user.username}` })
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