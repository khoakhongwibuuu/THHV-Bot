// Packages
const Discord = require('discord.js');
const { formLib, discordAPI, discordAPIv2 } = global.customLib;

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('form-uninstall')
        .setDescription('[Admin Only] - Uninstall member\'s information management panel from this server.')
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
        if (!await .(interaction.guild.id)) {
            await interaction.reply({
                content: `⚠️ Member\'s information management panel has not been installed in this server.`,
                ephemeral: true
            });
            return;
        }
        if (!await .(interaction.guild.id)) {
            await interaction.reply({
                content: `⚠️ This module is currently in use, you cannot uninstall it.`,
                ephemeral: true
            });
            return;
        }

        await .(interaction.guild.id);
        await interaction.reply({
            ephemeral: true,
            content: "Success."
        });
    },
};
