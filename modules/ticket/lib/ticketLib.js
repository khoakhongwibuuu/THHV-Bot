// Packages
const fs = require('node:fs');
const path = require('node:path');
const { dirname } = global.variable;

const handlersPath = path.join(dirname, 'modules/ticket/handler');

let guildsConfig = {};

const getGuildFilePath = (guildId) =>
    path.join(dirname, 'modules/ticket/config', `${guildId}.json`);

const isSetup = (guildId) =>
    guildsConfig.hasOwnProperty(guildId);


// File operations
const loadGuildFile = (guildId) =>
    JSON.parse(fs.readFileSync(getGuildFilePath(guildId)));


const writeGuildFile = (guildId, newData) =>
    fs.writeFileSync(getGuildFilePath(guildId), JSON.stringify(newData), 'utf8');

// Module startup
const preLoad = (guildId) => {
    const guildData = loadGuildFile(guildId);
    guildsConfig[guildId] = guildData;
}

// (un)installation
const guildSetup = (guildId, data) => {
    if (!isSetup(guildId)) {
        guildsConfig[guildId] = data;
        writeGuildFile(guildId, guildsConfig[guildId]);
    }
}

const guildUninstall = (guildId) => {
    if (!isSetup(guildId)) return false;
    delete guildsConfig[guildId];
    fs.unlinkSync(getGuildFilePath(guildId));
    return true;
}

const getRootChannel = (guildId) =>
    isSetup(guildId) ? guildsConfig[guildId].rootChannel : null;

const getExistingTickets = (guildId) =>
    isSetup(guildId) ? Object.keys(guildsConfig[guildId].running) : [];

const isOccupied = (guildId, userId) =>
    isSetup(guildId) ? Object.values(guildsConfig[guildId].running).includes(userId) : false;

const addOccupation = (guildId, channelId, userId) => {
    if (isSetup(guildId)) {
        guildsConfig[guildId].running[channelId] = userId;
        writeGuildFile(guildId, guildsConfig[guildId]);
    }
}

const removeOccupation = (guildId, channelId) => {
    if (isSetup(guildId)) {
        delete guildsConfig[guildId].running[channelId];
        writeGuildFile(guildId, guildsConfig[guildId]);
    }
}

const getGuildConfig = (guildId) =>
    isSetup(guildId) ? guildsConfig[guildId] : null;

module.exports = {
    handlersPath,
    getGuildFilePath,
    isSetup,
    loadGuildFile,
    writeGuildFile,
    preLoad,
    guildSetup,
    guildUninstall,
    getRootChannel,
    getExistingTickets,
    isOccupied,
    addOccupation,
    removeOccupation,
    getGuildConfig
}