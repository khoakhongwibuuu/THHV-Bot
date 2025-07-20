// Packages
const fs = require('node:fs');
const path = require('node:path');
const { dirname } = global.variable;
const { discordAPI } = global.customLib;

const handlersPath = path.join(dirname, 'modules/approval-form/handler');

let guildsConfig = {};
const cachedFormsRequests = {};

const getGuildFilePath = (guildId) =>
    path.join(dirname, 'modules/approval-form/config', `${guildId}.json`);

const isSetup = (guildId) =>
    guildsConfig.hasOwnProperty(guildId);

const loadGuildFile = (guildId) => JSON.parse(fs.readFileSync(getGuildFilePath(guildId), 'utf-8'));

const writeGuildFile = (guildId, newData) => fs.writeFileSync(getGuildFilePath(guildId), JSON.stringify(newData), 'utf8');

const preLoad = (guildId) => {
    const guildData = loadGuildFile(guildId);
    guildsConfig[guildId] = guildData;
}

// Installation-Uninstallation
const guildSetup = (guildId, data) => {
    if (isSetup(guildId)) return false;
    guildsConfig[guildId] = data;
    writeGuildFile(guildId, data);
    return true;
}

const guildUninstall = (guildId) => {
    if (!isSetup(guildId)) return false;
    delete guildsConfig[guildId];
    fs.unlinkSync(getGuildFilePath(guildId));
    return true;
}

const getGuildConfig = (guildId) => isSetup(guildId) ? guildsConfig[guildId] : null;

const memberIsVerified = (guildId, userId) => {
    const member = discordAPI.GuildMember(guildId, userId);
    return member.roles.cache.has(guildsConfig[guildId].role);
}

const addMemberToApprovalQueue = (guildId, userId) => {
    if (isSetup(guildId)) {
        guildsConfig[guildId].waitApproval[userId] = 1;
        writeGuildFile(guildId, guildsConfig[guildId]);
    }
}

const removeMemberFromApprovalQueue = (guildId, userId) => {
    if (isSetup(guildId)) {
        if (guildsConfig[guildId].waitApproval.hasOwnProperty(userId))
            delete guildsConfig[guildId].waitApproval[userId];
        writeGuildFile(guildId, guildsConfig[guildId]);
    }
}

const memberIsInApprovalQueue = (guildId, userId) => {
    if (!isSetup(guildId)) return false;
    else return guildsConfig[guildId].waitApproval.hasOwnProperty(userId);
}

const addMemberToCache = (guildId, userId) => {
    if (isSetup(guildId)) {
        if (!cachedFormsRequests.hasOwnProperty(guildId))
            cachedFormsRequests[guildId] = {}
        cachedFormsRequests[guildId][userId] = 1;
    }
}

const removeMemberFromCache = (guildId, userId) => {
    if (isSetup(guildId)) {
        if (cachedFormsRequests.hasOwnProperty(guildId)) {
            if (cachedFormsRequests[guildId].hasOwnProperty(userId))
                delete cachedFormsRequests[guildId][userId];
        }
    }
}

const memberIsInCache = (guildId, userId) => {
    if (!isSetup(guildId)) return false;
    else return (cachedFormsRequests[guildId]
        && cachedFormsRequests[guildId][userId]);
}

module.exports = {
    handlersPath,
    getGuildFilePath,
    isSetup,
    loadGuildFile,
    writeGuildFile,
    preLoad,
    guildSetup,
    guildUninstall,
    getGuildConfig,
    memberIsVerified,
    addMemberToApprovalQueue,
    removeMemberFromApprovalQueue,
    memberIsInApprovalQueue,
    addMemberToCache,
    removeMemberFromCache,
    memberIsInCache
}