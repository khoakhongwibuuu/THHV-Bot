// Packages
const Discord = require('discord.js');
const { autoPinLib, discordAPI } = global.customLib;

module.exports = {
    deprecated: true,
    data: new Discord.SlashCommandBuilder()
        .setName('react2pin-exclude')
        .setDescription('[Deprecated] - Exclude this channel from react2pin tracking module.')
        .setDMPermission(false)
    ,
    async execute(interaction) {

    },
};
