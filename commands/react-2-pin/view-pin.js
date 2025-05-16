// Packages
const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');

// Module Specified
const autoPinLib = require(path.join(global.dirname, 'modules/react-2-pin/lib/autoPinLib.js'));

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('react2pin-view')
        .setDescription('View channels monitored by react2pin module.')
        .setDMPermission(false)
    ,
    async execute(interaction) {
        if (!autoPinLib.isSetup(interaction.guild.id)) {
            interaction.reply({
                content: "There is no channels in this server being tracked by react2pin module.",
                ephemeral: true
            });
            return;
        }
        const trackedChannels = autoPinLib.viewAllChannels(interaction.guild.id);
        const sentEmbed = new Discord.EmbedBuilder();
        sentEmbed.setTitle(`There ${(trackedChannels.length === 1) ? "is" : "are"} ${trackedChannels.length} ${(trackedChannels.length === 1) ? "channel" : "channels"} being tracked by react2pin module.`);
        let content = "";
        trackedChannels.forEach(e => content += `* :pushpin: <#${e}>\n`);
        sentEmbed.setDescription(content);
        interaction.reply({
            embeds: [sentEmbed],
            ephemeral: true
        })
    },
};
