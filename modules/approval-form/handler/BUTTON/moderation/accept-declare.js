const Discord = require('discord.js');
const { client } = global.variable;
const { formLib, discordAPI } = global.customLib;

const isUserInGuild = async (guildId, userId) => {
    try {
        const guild = await client.guilds.fetch(guildId);
        await guild.members.fetch(userId);
        return true;
    } catch (error) {
        return false;
    }
}

module.exports.exec = async (interaction, clientMemberId) => {
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

    formLib.removeMemberFromApprovalQueue(interaction.guild.id, clientMemberId);

    const isMemberOfGuild = await isUserInGuild(interaction.guild.id, clientMemberId);
    if (isMemberOfGuild) {
        const clientMember = discordAPI.GuildMember(
            interaction.guild.id,
            clientMemberId
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
            + `\n* Thời điểm duyệt yêu cầu: <t:${Math.floor(interaction.createdTimestamp / 1000)}:F>`
        );

        await interaction.message.edit({
            embeds: [sentEmbed],
            components: []
        });

        await interaction.reply({
            ephemeral: true,
            content: `Đã thêm Role <@&${verifyRole.id}> cho <@${clientMemberId}>.`
        });
    } else {
        const sentEmbed = Discord.EmbedBuilder.from(interaction.message.embeds[0])
            .setColor(0xffc114)
            .setFooter({ text: `⚠️ Thành viên đã rời server trước đó` });

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
            content: `Không thể duyệt yêu cầu: <@${clientMemberId}> đã rời khỏi server trước đó.`
        });
        return;
    }
}