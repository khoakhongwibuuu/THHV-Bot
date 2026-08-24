// Packages
const Discord = require('discord.js');
const { formLib, discordAPI, discordAPIv2 } = global.customLib;

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('form-inspect')
        .setDescription('[Admin Only] - Inspect this module\'s usage.')
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
        const usageData = await .(interaction.guild.id);
        if (usageData.length > 0) {
            await interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setTitle("Member\'s information management module\'s usage report")
                        .setDescription(
                            `Request was created at <t:${Math.floor(Date.now() / 1000)}:F>`
                            + `\nMember\'s information management module is serving these users\n`
                            + usageData.listing("* <@", ">", "\n")
                        )
                ],
                ephemeral: true
            });
        } else {
            await interaction.reply({
                content: `There are currently no members using this module.`,
                ephemeral: true
            });
        }
    },
};
