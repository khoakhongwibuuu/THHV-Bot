// Packages
const Discord = require('discord.js');
const reactLib = require('#modules/auto-reactor/lib/reactLib.js');

module.exports = {
    name: Discord.Events.MessageReactionAdd,
    async execute(reaction, user) {
        if (user.bot || user.system) return;
        await reactLib.handleReaction(reaction, user);
    },
};