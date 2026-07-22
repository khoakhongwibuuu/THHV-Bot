// Packages
const Discord = require('discord.js');
const { formLib, discordAPI } = global.customLib;


module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('form-list-unverified')
        .setDescription('[Moderators Only] - List unverified members in this server.')
        .setDMPermission(false)
    ,
    async execute(interaction) {
        if (!discordAPI.isModerator(interaction.guild.id, interaction.user.id)) {
            await interaction.reply({
                content: "🚫 You do not have permission to run this command.",
                ephemeral: true
            });
            return;
        }
        if (!formLib.isSetup(interaction.guild.id)) {
            await interaction.reply({
                content: `⚠️ Member\'s information management panel has not been installed in this server.`,
                ephemeral: true
            });
            return;
        }

    },
};
