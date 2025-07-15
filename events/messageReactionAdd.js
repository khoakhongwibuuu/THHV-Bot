// Packages
const Discord = require('discord.js');
const { autoPinLib, reactLib } = global.customLib;

module.exports = {
    name: Discord.Events.MessageReactionAdd,
    async execute(reaction, user) {
        if (user.bot || user.system) return;
        await reactLib.handleReaction(reaction, user);
        await autoPinLib.handleRequest(reaction, user);
    },
};