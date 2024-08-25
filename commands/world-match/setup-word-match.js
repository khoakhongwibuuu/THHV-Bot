// Packages
const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');

// Universal
const dirname = global.dirname;
const stdlib = global.stdlib;
const discordAPI = global.discordAPI;

// Module Specified
const wordLib = require(path.join(dirname, 'modules/word-match/lib/wordLib.js'));

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('setup-wordmatch')
        .setDescription('Set wordMatch game at this channel.')
    ,
    async execute(interaction) {
        if (discordAPI.isModerator(interaction.guild.id, interaction.user.id)) {
            wordLib.guildSetup(interaction.guild.id, interaction.channel.id);
            interaction.reply({
                content: `Game channel has been set. You can start with any English word now.`,
                ephemeral: false
            });
        } else {
            interaction.reply({
                content: "You do not have permission to run this command.",
                ephemeral: true
            });
        }
    },
};
