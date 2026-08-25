const Discord = require('discord.js');
const { client } = require('#assets/library/state.js');

/**
 * Fetches a guild by its ID.
 * Cache -> Fetch -> null
 */
const Guild = async (id) => {
    const guild = client.guilds.cache.get(id);
    if (guild) return guild;

    try {
        return await client.guilds.fetch(id);
    } catch {
        return null;
    }
};

/**
 * Fetches a user by their ID.
 * Cache -> Fetch -> null
 */
const User = async (id) => {
    const user = client.users.cache.get(id);
    if (user) return user;

    try {
        return await client.users.fetch(id);
    } catch {
        return null;
    }
};


/**
 * Fetches a guild member by ID.
 * Cache -> Fetch -> null
 */
const GuildMember = async (guildId, memberId) => {
    const guild = await Guild(guildId);
    if (!guild) return null;

    const member = guild.members.cache.get(memberId);
    if (member) return member;

    try {
        return await guild.members.fetch(memberId);
    } catch {
        return null;
    }
};

/**
 * Fetches all members of a guild.
 * Always fetches from Discord and returns an array of GuildMember.
 */
const AllMembersOfGuild = async (guildId) => {
    const guild = await Guild(guildId);
    if (!guild) return null;

    try {
        const members = await guild.members.fetch();

        // guild.members.fetch() returns Collection<Snowflake, GuildMember> so a null check is unnecessary
        return Array.from(members.values());
    } catch {
        return null;
    }
};

/**
 * Fetches a role by ID.
 * Cache -> Fetch -> null
 */
const GuildRole = async (guildId, roleId) => {
    const guild = await Guild(guildId);
    if (!guild) return null;

    const role = guild.roles.cache.get(roleId);
    if (role) return role;

    try {
        return await guild.roles.fetch(roleId);
    } catch {
        return null;
    }
};

/**
 * Fetches all roles of a guild.
 * Always fetches from Discord and returns the updated cache.
 */
const AllRolesOfGuild = async (guildId) => {
    const guild = await Guild(guildId);
    if (!guild) return null;

    try {
        const roles = await guild.roles.fetch();

        // guild.roles.fetch() returns Collection<Snowflake, Role> so a null check is unnecessary
        return Array.from(roles.values());
    } catch {
        return null;
    }
};

/**
 * Fetches a channel by ID.
 * Cache -> Fetch -> null
 */
const GuildChannel = async (guildId, channelId) => {
    const guild = await Guild(guildId);
    if (!guild) return null;

    const channel = guild.channels.cache.get(channelId);
    if (channel) return channel;

    try {
        return await guild.channels.fetch(channelId);
    } catch {
        return null;
    }
};

/**
 * Fetches all channels of a guild.
 * Always fetches from Discord and returns an array of GuildChannel.
 */
const AllChannelsOfGuild = async (guildId) => {
    const guild = await Guild(guildId);
    if (!guild) return null;

    try {
        const channels = await guild.channels.fetch();

        // guild.channels.fetch() returns Collection<Snowflake, GuildBasedChannel | null> so a null check is required
        return Array.from(channels.values()).filter(channel => channel !== null);
    } catch {
        return null;
    }
};

/**
 * Checks whether a user is a member of a guild.
 * @param {string} guildId - The guild ID.
 * @param {string} userId - The user ID.
 * @returns {Promise<boolean>} True if the user is a member, otherwise false.
 */

const isMember = async (guildId, userId) => {
    const member = await GuildMember(guildId, userId);
    return member !== null;
};

/**
 * Checks if a user is an administrator.
 * @param {string} guildId - The guild ID.
 * @param {string} userId - The user ID.
 * @returns {Promise<boolean>} True if the user has admin access, otherwise false.
 */
const isAdmin = async (guildId, userId) => {
    const member = await GuildMember(guildId, userId);

    return !!member?.permissions.has(
        Discord.PermissionsBitField.Flags.Administrator
    );
};

/**
 * Checks if a user is a moderator.
 * @param {string} guildId - The guild ID.
 * @param {string} userId - The user ID.
 * @returns {Promise<boolean>} True if the user has moderator access, otherwise false.
 */
const isModerator = async (guildId, userId) => {
    const member = await GuildMember(guildId, userId);
    if (!member) return false;

    const { Flags } = Discord.PermissionsBitField;

    return (
        member.permissions.has(Flags.ManageChannels) ||
        member.permissions.has(Flags.ManageWebhooks) ||
        member.permissions.has(Flags.ManageGuild) ||
        member.permissions.has(Flags.ManageMessages) ||
        member.permissions.has(Flags.ManageThreads) ||
        member.permissions.has(Flags.KickMembers) ||
        member.permissions.has(Flags.BanMembers) ||
        member.permissions.has(Flags.ModerateMembers)
    );
};

module.exports = {
    Guild,
    User,
    GuildMember,
    AllMembersOfGuild,
    GuildRole,
    AllRolesOfGuild,
    GuildChannel,
    AllChannelsOfGuild,
    isMember,
    isAdmin,
    isModerator,
};