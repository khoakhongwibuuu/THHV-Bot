// Packages
const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');

// Module Specified
const ticketLib = require(path.join(global.dirname, 'modules/ticket/lib/ticketLib.js'));

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('ticket-uninstall')
        .setDescription('[Moderators Only] - Uninstall ticket module from this server.')
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
        if (!ticketLib.isSetup(interaction.guild.id)) {
            interaction.reply({
                content: `⚠️ Ticket module has not been installed in this server.`,
                ephemeral: true
            });
            return;
        }
        if (ticketLib.getExistingTickets(interaction.guild.id).length !== 0) {
            interaction.reply({
                content: `⚠️ You still have ${ticketLib.getExistingTickets(interaction.guild.id).length} un-closed tickets.`
                    + `\nPlease close them before uninstalling.`,
                ephemeral: true
            });
            return;
        }
        ticketLib.guildReset(interaction.guild.id);
        interaction.reply({
            ephemeral: true,
            content: "Success."
        });
    },
};
