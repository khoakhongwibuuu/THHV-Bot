// Packages
const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');

// Module Specified
const autoPinLib = require(path.join(global.dirname, 'modules/react-2-pin/lib/autoPinLib.js'));

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('react2pin-exclude')
        .setDescription('[Moderators Only] - Exclude this channel from react2pin tracking module.')
        .setDMPermission(false)
    ,
    async execute(interaction) {
        if (!global.discordAPI.isModerator(interaction.guild.id, interaction.user.id)) {
            interaction.reply({
                content: "🚫 You do not have permission to run this command.",
                ephemeral: true
            });
            return;
        }
        if (autoPinLib.excludeChannel(interaction.guild.id, interaction.channel.id))
            interaction.reply({
                content: `✅ Successfully excluded this channel into react2pin tracking module.`,
                ephemeral: true
            });
        else
            interaction.reply({
                content: `🚫 Nothing changed. This channel is not being tracked by react2pin tracking module.`,
                ephemeral: true
            });
    },
};
