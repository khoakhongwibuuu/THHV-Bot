// Packages
const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');

// Module Specified
const autoPinLib = require(path.join(global.dirname, 'modules/react-2-pin/lib/autoPinLib.js'));

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('react2pin-reset')
        .setDescription('[Moderators Only] - Exclude any included channels of this server in the react2pin tracking module.')
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
        if (autoPinLib.guildReset(interaction.guild.id, interaction.channel.id))
            interaction.reply({
                content: `✅ Successfully reseted this server.`,
                ephemeral: true
            });
        else
            interaction.reply({
                content: `🚫 Nothing changed. There is no channels in this server being tracked by react2pin module.`,
                ephemeral: true
            });
    },
};
