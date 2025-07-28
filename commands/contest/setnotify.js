// Packages
const Discord = require('discord.js');
const { contestLib, discordAPI } = global.customLib;

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
        if (!discordAPI.isModerator(interaction.guild.id, interaction.user.id)) {
            await interaction.reply({
                content: "🚫 You do not have permission to run this command.",
                ephemeral: true
            });
            return;
        }

        const Persist = await contestLib.loadPersist();
        Persist.channel[interaction.guild.id] = interaction.channel.id;
        Persist.ready[interaction.guild.id] = true;

        const roleNotified = interaction.options.getRole('role') ?? { id: "" };
        Persist.role[interaction.guild.id] = roleNotified.id;

        await contestLib.savePersist(Persist);

        await interaction.reply({
            content: `Notification channel has been set at <#${interaction.channel.id}>. I will notify${(roleNotified.id != "")
                ? ` members this role <@&${roleNotified.id}>`
                : ""
                } \`24\` hours before a contest.`,
            ephemeral: true
        });
    },
};
