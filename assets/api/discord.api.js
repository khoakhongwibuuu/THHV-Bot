const Discord = require('discord.js');
const { client } = global.variable;

/**
 * Fetches a guild by its ID.
 * @param {string} id - The ID of the guild.
 * @returns {Guild|null} The guild object or null if not found.
 */
const Guild = (id) => {
    const guildEntity = client.guilds.cache.get(id)
    return (guildEntity) ? guildEntity : null;
}

/**
 * Fetches a user by their ID.
 * @param {string} id - The ID of the user.
 * @returns {User|null} The user object or null if not found.
 */
const User = (id) => {
    const userEntity = client.users.cache.get(id);
    return (userEntity) ? userEntity : null;
}

/**
 * Fetches a guild member by their ID.
 * @param {string} guildId - The ID of the guild.
 * @param {string} memberId - The ID of the member.
 * @returns {GuildMember|null} The guild member object or null if not found.
 */
const GuildMember = (guildId, memberId) => {
    const guildEntity = Guild(guildId);
    if (guildEntity) {
        const guildMemberEntity = guildEntity.members.cache.get(memberId);
        return (guildMemberEntity) ? guildMemberEntity : null;
    } else {
        return null;
    }
}

/**
 * Fetches a guild role by its ID.
 * @param {string} guildId - The ID of the guild.
 * @param {string} roleId - The ID of the role.
 * @returns {GuildRole|null} The guild role object or null if not found.
 */
const GuildRole = (guildId, roleId) => {
    const guildEntity = Guild(guildId);
    if (guildEntity) {
        const guildRoleEntity = guildEntity.roles.cache.get(roleId);
        return (guildRoleEntity) ? guildRoleEntity : null;
    } else {
        return null;
    }
}

/**
 * Fetches a guild channel by its ID.
 * @param {string} guildId - The ID of the guild.
 * @param {string} channelId - The ID of the channel.
 * @returns {GuildChannel|null} The guild channel object or null if not found.
 */
const GuildChannel = (guildId, channelId) => {
    const guildEntity = Guild(guildId);
    if (guildEntity) {
        const guildChannelEntity = guildEntity.channels.cache.get(channelId);
        return (guildChannelEntity) ? guildChannelEntity : null;
    } else {
        return null;
    }
}

/**
 * Checks if a user is an administrator in a guild.
 * @param {string} guildId - The ID of the guild.
 * @param {string} userId - The ID of the user.
 * @return {boolean} True if the user is an admin, false otherwise.
 */
const isAdmin = (guildId, userId) => {
    const member = GuildMember(guildId, userId);
    return (member) ? member.permissions.has(Discord.PermissionsBitField.Flags.Administrator) : false;
}

/**
 * Checks if a user is a moderator in a guild.
 * @param {string} guildId - The ID of the guild.
 * @param {string} userId - The ID of the user.
 * @return {boolean} True if the user is a moderator, false otherwise.
 */
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