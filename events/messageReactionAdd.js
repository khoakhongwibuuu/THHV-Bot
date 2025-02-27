const Discord = require('discord.js');
const path = require('path');

module.exports = {
    name: Discord.Events.MessageReactionAdd,
    async execute(reaction, user) {
        if (user.bot || user.system) return;

    },
};