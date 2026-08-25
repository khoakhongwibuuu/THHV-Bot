// Packages
const Discord = require('discord.js');
const formLib = require('#modules/approval-form/lib/formLib.js');
const discordAPI = require('#assets/api/discord.api.js');
const discordAPIv2 = require('#assets/api/discord.api.v2.js');


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
        if (!(await formLib.isSetup(interaction.guild.id))) {
            await interaction.reply({
                content: `⚠️ Member\'s information management panel has not been installed in this server.`,
                ephemeral: true
            });
            return;
        }

    },
};
