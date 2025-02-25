const Discord = require('discord.js');
const client = global.client;

// Fetching
const Guild = (id) => {
    const guildEntity = client.guilds.cache.get(id)
    return (guildEntity) ? guildEntity : null;
}

const User = (id) => {
    const userEntity = client.users.cache.get(id);
    return (userEntity) ? userEntity : null;
}

const GuildMember = (guildId, memberId) => {
    const guildEntity = Guild(guildId);
    if (guildEntity) {
        const guildMemberEntity = guildEntity.members.cache.get(memberId);
        return (guildMemberEntity) ? guildMemberEntity : null;
    } else {
        return null;
    }
}

const GuildRole = (guildId, roleId) => {
    const guildEntity = Guild(guildId);
    if (guildEntity) {
        const guildRoleEntity = guildEntity.roles.cache.get(roleId);
        return (guildRoleEntity) ? guildRoleEntity : null;
    } else {
        return null;
    }
}

const GuildChannel = (guildId, channelId) => {
    const guildEntity = Guild(guildId);
    if (guildEntity) {
        const guildChannelEntity = guildEntity.channels.cache.get(channelId);
        return (guildChannelEntity) ? guildChannelEntity : null;
    } else {
        return null;
    }
}

const isAdmin = (guildId, userId) => {
    const member = GuildMember(guildId, userId);
    return (member) ? member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) : false;
}

const isModerator = (guildId, userId) => {
    const member = GuildMember(guildId, userId);
    return (member) ? member.permissions.has(Discord.PermissionsBitField.Flags.ManageChannels)
        || member.permissions.has(Discord.PermissionsBitField.Flags.ManageWebhooks)
        || member.permissions.has(Discord.PermissionsBitField.Flags.ManageGuild)
        || member.permissions.has(Discord.PermissionsBitField.Flags.ManageMessages)
        || member.permissions.has(Discord.PermissionsBitField.Flags.ManageThreads)
        || member.permissions.has(Discord.PermissionsBitField.Flags.KickMembers)
        || member.permissions.has(Discord.PermissionsBitField.Flags.BanMembers)
        || member.permissions.has(Discord.PermissionsBitField.Flags.ModerateMembers)
        : false;
}

module.exports = {
    Guild,
    User,
    GuildMember,
    GuildRole,
    GuildChannel,
    isAdmin,
    isModerator
}