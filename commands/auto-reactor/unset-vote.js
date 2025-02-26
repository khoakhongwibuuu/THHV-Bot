// Packages
const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');

// Universal
const dirname = global.dirname;
const stdlib = global.stdlib;
const discordAPI = global.discordAPI;

// Module Specified
const reactLib = require(path.join(dirname, 'modules/auto-reactor/lib/reactLib.js'));

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('vote-unset')
        .setDescription('[Moderators Only] - Disable voting feature at this channel.')
        .setDMPermission(false)
    ,
    async execute(interaction) {
        if (!discordAPI.isModerator(interaction.guild.id, interaction.user.id)) {
            interaction.reply({
                content: "🚫 You do not have permission to run this command.",
                ephemeral: true
            });
            return;
        }
        if (!reactLib.isSetup(interaction.guild.id)) {
            interaction.reply({
                content: "⚠️ Voting feature has not been enabled at this server.",
                ephemeral: true
            });
            return;
        }
        reactLib.guildReset(interaction.guild.id);
        if (!reactLib.isSetup(interaction.guild.id)) {
            interaction.reply({
                content: "Voting feature has been disabled successfully.",
                ephemeral: true
            });
            return;
        }
    },
};
