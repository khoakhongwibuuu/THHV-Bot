// Packages
const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');

// Universal
const dirname = global.dirname;
const stdlib = global.stdlib;
const discordAPI = global.discordAPI;

// Module Specified
const cfLib = require(path.join(dirname, 'modules/codeforces-contest/lib/cf.js'));

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('setnotify')
        .setDescription('[Moderators Only] - Set Codeforces contests notification module at this channel.')
        .addRoleOption(option =>
            option.setName("role")
                .setDescription("The role to be notified.")
                .setRequired(false)
        )
        .addChannelOption(option =>
            option.setName("forum-channel")
                .setDescription("If set, a post will be created in this forum channel about the contest.")
                .setRequired(false)
        )
        .setDMPermission(false)
    ,
    async execute(interaction) {
        if (!discordAPI.isModerator(interaction.guild.id, interaction.user.id)) {
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
        const forumChannel = interaction.options.getChannel('forum-channel') ?? { id: "" };

        Persist.role[interaction.guild.id] = roleNotified.id;

        // Validate: if the chosen channel is a Forum
        const testChannel = discordAPI.GuildChannel(interaction.guild.id, forumChannel.id);
        if (testChannel) {
            if (testChannel.type !== Discord.ChannelType.GuildForum) {
                interaction.reply({
                    content: "⚠️ You have not provided a valid Forum channel. Please try again.",
                    ephemeral: true
                });
                return;
            }

        }
        
        Persist.forum[interaction.guild.id] = forumChannel.id;
        cfLib.savePersist(Persist);

        interaction.reply({
            content: `Notification channel has been set at <#${interaction.channel.id}>. I will notify${(roleNotified.id != "") ? ` members this role <@&${roleNotified.id}>` : ""} \`24\` hours before a contest.`
                + ((forumChannel.id != "") ? `\nAlso, I will create a post about the contest at <#${forumChannel.id}> when contest notification arrives.` : ""),
            ephemeral: true
        });
    },
};
