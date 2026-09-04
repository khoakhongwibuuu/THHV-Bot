const Discord = require('discord.js');
const { client } = require('#assets/library/state.js');
const formLib = require('#modules/approval-form/lib/formLib.js');
const discordAPIv2 = require('#assets/api/discord.api.v2.js');

const getRolesByName = async (guildId, roleName) => {
    const allRoles = await discordAPIv2.AllRolesOfGuild(guildId);
    if (!allRoles) return [];
    return allRoles.filter(role => role.name === roleName);
}

const extract_K_Value = (str) => str.slice("\`\`\`\n".length, str.lastIndexOf("\n\`\`\`"));

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

    const isMemberOfGuild = await discordAPIv2.isMember(interaction.guild.id, clientMemberId);

    if (isMemberOfGuild) {
        const clientMember = await discordAPIv2.GuildMember(
            interaction.guild.id,
            clientMemberId
        );
        const verifyRole = await discordAPIv2.GuildRole(
            interaction.guild.id,
            (await formLib.getGuildConfig(interaction.guild.id)).role
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

        const additionalRoles = await getRolesByName(interaction.guild.id, `k${extract_K_Value(interaction.message.embeds[0].fields[1].value)}`);
        if (additionalRoles && additionalRoles.length && additionalRoles.length > 0) {
            let followUpContent = `Đã thêm role: `;
            additionalRoles.forEach(async role => {
                followUpContent += `<@&${role.id}> `;
                await clientMember.roles.add(role);
            });
            followUpContent += `cho <@${clientMemberId}>.`
            await interaction.followUp({
                ephemeral: true,
                content: followUpContent
            });
        }
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
