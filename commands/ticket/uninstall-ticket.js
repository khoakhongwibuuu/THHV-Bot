// Packages
const Discord = require('discord.js');
const { ticketLib, discordAPI, discordAPIv2 } = global.customLib;

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('ticket-uninstall')
        .setDescription('[Admin Only] - Uninstall ticket module from this server.')
        .setDMPermission(false)
    ,
    async execute(interaction) {
        const isAdmin = await discordAPIv2.isAdmin(interaction.guild.id, interaction.user.id);
        // if (!discordAPI.isAdmin(interaction.guild.id, interaction.user.id)) {
        if (!isAdmin) {
            await interaction.reply({
                content: "🚫 You do not have permission to run this command.",
                ephemeral: true
            });
            return;
        }
        if (!(await ticketLib.isSetup(interaction.guild.id))) {
            await interaction.reply({
                content: `⚠️ Ticket module has not been installed in this server.`,
                ephemeral: true
            });
            return;
        }
        if ((await ticketLib.getExistingTickets(interaction.guild.id).length) !== 0) {
            await interaction.reply({
                content: `⚠️ You still have ${await .(interaction.guild.id).length} un-closed tickets.`
                    + `\nPlease close them before uninstalling.`,
                ephemeral: true
            });
            return;
        }
        await ticketLib.guildUninstall(interaction.guild.id);
        await interaction.reply({
            ephemeral: true,
            content: "Success."
        });
    },
};
