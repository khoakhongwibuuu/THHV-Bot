// Packages
const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');

// Module Specified
const cfLib = require(path.join(global.dirname, 'modules/codeforces-contest/lib/cf.js'));

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
        if (!global.discordAPI.isModerator(interaction.guild.id, interaction.user.id)) {
            interaction.reply({
                content: "🚫 You do not have permission to run this command.",
                ephemeral: true
            });
            return;
        }

        const Persist = cfLib.loadPersist();
        Persist.channel[interaction.guild.id] = interaction.channel.id;
        Persist.ready[interaction.guild.id] = true;

        const roleNotified = interaction.options.getRole('role') ?? { id: "" };
        Persist.role[interaction.guild.id] = roleNotified.id;

        cfLib.savePersist(Persist);

        interaction.reply({
            content: `Notification channel has been set at <#${interaction.channel.id}>. I will notify${
                (roleNotified.id != "")
                ? ` members this role <@&${roleNotified.id}>`
                : ""
            } \`24\` hours before a contest.`,
            ephemeral: true
        });
    },
};
