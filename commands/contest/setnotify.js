// Packages
const Discord = require('discord.js');
const { contestLib, discordAPIv2 } = global.customLib;

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('setnotify')
        .setDescription('[Moderators Only] - Set Codeforces contests notification module at this channel.')
        .addRoleOption(option =>
            option.setName("role")
                .setDescription("The role to be notified.")
                .setRequired(false)
        )
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

        const roleNotified = interaction.options.getRole('role');
        const roleId = roleNotified ? roleNotified.id : null;
        
        await contestLib.guildSetup(interaction.guild.id, interaction.channel.id, roleId);

        await interaction.reply({
            content: `Notification channel has been set at <#${interaction.channel.id}>. I will notify${roleId
                ? ` members with this role <@&${roleId}>`
                : ""
                } \`24\` hours before a contest.`,
            ephemeral: true
        });
    },
};