// Packages
const Discord = require('discord.js');
const { autoPinLib } = global.customLib;

module.exports = {
    deprecated: true,
    data: new Discord.SlashCommandBuilder()
        .setName('react2pin-view')
        .setDescription('[Deprecated] - View channels monitored by react2pin module.')
        .setDMPermission(false)
    ,
    async execute(interaction) {

    },
};
