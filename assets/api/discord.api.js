const Discord = require('discord.js');
const client = global.client;

// Fetching
const Guild = (id) => {
    const e = client.guilds.cache.get(id)
    return (e) ? e : null;
}

const User = (id) => {
    const e = client.users.cache.get(id);
    return (e) ? e : null;
}

const GuildMember = (guildId, memberId) => {
    const e = Guild(guildId).members.cache.get(memberId);
    return (e) ? e : null;
}

const GuildRole = (guildId, roleId) => {
    const e = Guild(guildId).roles.cache.get(roleId);
    return (e) ? e : null;
}

const GuildChannel = (guildId, channelId) => {
    const e = Guild(guildId).channels.cache.get(channelId);
    return (e) ? e : null;
}

module.exports.Guild = Guild;
module.exports.User = User;
module.exports.GuildMember = GuildMember;
module.exports.GuildRole = GuildRole;
module.exports.GuildChannel = GuildChannel;

const isAdmin = (guildId, userId) => {
    const member = GuildMember(guildId, userId);
    return member.permissions.has(Discord.PermissionsBitField.Flags.Administrator);
}

const isModerator = (guildId, userId) => {
    const member = GuildMember(guildId, userId);
    return member.permissions.has(Discord.PermissionsBitField.Flags.ManageChannels)
        || member.permissions.has(Discord.PermissionsBitField.Flags.ManageWebhooks)
        || member.permissions.has(Discord.PermissionsBitField.Flags.ManageGuild)
        || member.permissions.has(Discord.PermissionsBitField.Flags.ManageMessages)
        || member.permissions.has(Discord.PermissionsBitField.Flags.ManageThreads)
        || member.permissions.has(Discord.PermissionsBitField.Flags.KickMembers)
        || member.permissions.has(Discord.PermissionsBitField.Flags.BanMembers)
        || member.permissions.has(Discord.PermissionsBitField.Flags.ModerateMembers)
        ;
}

module.exports.isAdmin = isAdmin;
module.exports.isModerator = isModerator;