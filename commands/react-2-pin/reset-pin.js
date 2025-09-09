// Packages
const Discord = require('discord.js');
const { autoPinLib, discordAPI } = global.customLib;

module.exports = {
    deprecated: true,
    data: new Discord.SlashCommandBuilder()
        .setName('react2pin-reset')
        .setDescription('[Deprecated] - Exclude any included channels of this server in the react2pin tracking module.')
        .setDMPermission(false)
    ,
    async execute(interaction) {

    },
};
