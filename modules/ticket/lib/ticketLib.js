// Packages
const fs = require('fs');
const path = require('path');
const ticket = require('./ticket');

let guildTickets = {};
/* IN-MEMORY STORAGE
guildTickets = {
    "guild-id-1": {
        "rootChannel": channelId,
        "rootCategory" : categoryId,
        "running" : {
            "ticket-id-1": ticket.ticketInstance(user.id),
            "ticket-id-2": ticket.ticketInstance(user.id),
            ...
        }
    },
    "guild-id-2": {
        "root-channel": channelId,
        "root-category" : categoryId,
        "running" : {
            "ticket-id-1": ticket.ticketInstance(user.id),
            "ticket-id-2": ticket.ticketInstance(user.id),
            ...
        }
    },
    ...
}
*/

const getGuildFilePath = (guildId) =>
    path.join(global.dirname, 'modules/ticket/config', `${guildId}.json`);

const isSetup = (guildId) =>
    guildTickets.hasOwnProperty(guildId);


// File operations
const loadGuildFile = (guildId) =>
    JSON.parse(fs.readFileSync(getGuildFilePath(guildId)));


const writeGuildFile = (guildId, newData) =>
    fs.writeFileSync(getGuildFilePath(guildId), JSON.stringify(newData), 'utf8');

// Module startup
const preLoad = (guildId) => {
    const guildData = loadGuildFile(guildId);
    guildTickets[guildId] = guildData;
}

// (un)installation
const guildSetup = (guildId, rootChannelId, rootCategoryID) => {
    if (!isSetup(guildId)) {
        guildTickets[guildId] = {};
        guildTickets[guildId].rootChannel = rootChannelId;
        guildTickets[guildId].rootCategory = rootCategoryID;
        guildTickets[guildId].running = {};
        writeGuildFile(guildId, guildTickets[guildId]);
    }
}

const getRootChannel = (guildId) =>
    isSetup(guildId) ? guildTickets[guildId].rootChannel : null;

const handleBtnInteraction = (interaction) => {
    
}

module.exports = {
    getGuildFilePath,
    isSetup,
    loadGuildFile,
    writeGuildFile,
    preLoad,
    guildSetup,
    getRootChannel,
    handleBtnInteraction
}