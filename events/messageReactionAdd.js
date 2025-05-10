const Discord = require('discord.js');
const path = require('path');

module.exports = {
    name: Discord.Events.MessageReactionAdd,
    async execute(reaction, user) {
        if (user.bot || user.system) return;
        await require(path.join(global.dirname, 'modules/auto-reactor/lib/reactLib.js')).handleReaction(reaction, user);
        // await require(path.join(global.dirname, 'modules/react-2-pin/lib/autoPinLib.js')).handleRequest(reaction, user);
    },
};