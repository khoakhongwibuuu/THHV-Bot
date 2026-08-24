// Packages
const Discord = require('discord.js');
const { reactLib, discordAPI, discordAPIv2 } = global.customLib;

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('vote-unset')
        .setDescription('[Moderators Only] - Disable voting feature at this channel.')
        .setDMPermission(false)
    ,
    async execute(interaction) {
        const isMod = await discordAPIv2.isModerator(interaction.guild.id, interaction.user.id);
        // if (!discordAPI.isModerator(interaction.guild.id, interaction.user.id)) {
        if (!isMod) {
            interaction.reply({
                content: "🚫 You do not have permission to run this command.",
                ephemeral: true
            });
            return;
        }
        if (!await .(interaction.guild.id)) {
            interaction.reply({
                content: "⚠️ Voting feature has not been enabled at this server.",
                ephemeral: true
            });
            return;
        }
        await .(interaction.guild.id);
        if (!await .(interaction.guild.id)) {
            interaction.reply({
                content: "Voting feature has been disabled successfully.",
                ephemeral: true
            });
            return;
        }
    },
};
