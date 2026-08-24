// Packages
const Discord = require('discord.js');
const { formLib, discordAPI, discordAPIv2 } = global.customLib;


module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('form-list-unverified')
        .setDescription('[Moderators Only] - List unverified members in this server.')
        .setDMPermission(false)
    ,
    async execute(interaction) {
        const isMod = await discordAPIv2.isModerator(interaction.guild.id, interaction.user.id);
        // if (!discordAPI.isModerator(interaction.guild.id, interaction.user.id)) {
        if (!isMod) {
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

    },
};
