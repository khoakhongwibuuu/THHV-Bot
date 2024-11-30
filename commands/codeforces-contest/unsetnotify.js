// Packages
const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');

// Universal
const dirname = global.dirname;
const stdlib = global.stdlib;
const discordAPI = global.discordAPI;

// Module Specified
const cfLib = require(path.join(dirname, 'modules/codeforces-contest/lib/cf.js'));

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('unsetnotify')
        .setDescription('[Hosts Only] - Reset every configured notification instances.')
        .setDMPermission(false)
    ,
    async execute(interaction) {
        if (process.env.OWNER_ID === interaction.user.id) {
            cfLib.wipePersist();
            interaction.reply({
                content: `Persist has been reseted.`,
                ephemeral: true
            });
        } else {
            interaction.reply({
                content: "🚫 You do not have permission to run this command.",
                ephemeral: true
            });
        }
    },
};
