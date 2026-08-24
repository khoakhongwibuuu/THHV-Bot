// Packages
const Discord = require('discord.js');
const { contestLib, discordAPIv2 } = global.customLib;

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('unsetnotify')
        .setDescription('[Moderators Only] - Turn off Codeforces contests notification module for this server.')
        .setDMPermission(false)
    ,
    async execute(interaction) {
        const isMod = await discordAPIv2.isModerator(interaction.guild.id, interaction.user.id);
        if (!isMod) {
            await interaction.reply({
                content: "🚫 You do not have permission to run this command.",
                ephemeral: true
            });
            return;
        }

        const success = await contestLib.guildUninstall(interaction.guild.id);
        
        if (success) {
            await interaction.reply({
                content: `Notification module has been turned off for this server.`,
                ephemeral: true
            });
        } else {
            await interaction.reply({
                content: `Notification module is not currently set up for this server.`,
                ephemeral: true
            });
        }
    },
};