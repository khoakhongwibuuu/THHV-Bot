// Packages
const Discord = require('discord.js');
const { ticketLib, discordAPI } = global.customLib;

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('ticket-setup')
        .setDescription('[Moderators Only] - Setup ticket init channel.')
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
        if (ticketLib.isSetup(interaction.guild.id)) {
            interaction.reply({
                content: `⚠️ Ticket module has been installed at <#${ticketLib.getRootChannel(interaction.guild.id)}>.`,
                ephemeral: true
            });
            return;
        }
        if (interaction.channel.isThread()) {
            interaction.reply({
                content: "⚠️ This command is not intended for thread channel uses.",
                ephemeral: true
            });
            return;
        }
        if (interaction.channel.isVoiceBased()) {
            interaction.reply({
                content: "⚠️ This command is not intended for voice channel uses.",
                ephemeral: true
            });
            return;
        }
        const categoryId = interaction.channel?.parentId ?? null;
        if (!categoryId) {
            interaction.reply({
                content: "⚠️ This channel does not belong to any category.",
                ephemeral: true
            });
            return;
        }
        const channelId = interaction.channel.id;
        const guildId = interaction.guild.id

        const modal = new Discord.ModalBuilder()
            .setCustomId(`ticket:MODAL:setup:${0}`)
            .setTitle("Customise your ticket interface.")
            .addComponents(
                new Discord.ActionRowBuilder().addComponents(
                    new Discord.TextInputBuilder()
                        .setCustomId('ticket-interface-title')
                        .setLabel("The title of your ticket interface.")
                        .setStyle(Discord.TextInputStyle.Short)
                        .setMaxLength(32)
                        .setMinLength(12)
                        .setPlaceholder('e.g. Do you need assistance ?')
                        .setRequired(true)
                ),
                new Discord.ActionRowBuilder().addComponents(
                    new Discord.TextInputBuilder()
                        .setCustomId('ticket-interface-desc')
                        .setLabel("The description of your ticket interface.")
                        .setStyle(Discord.TextInputStyle.Paragraph)
                        .setMaxLength(128)
                        .setMinLength(12)
                        .setPlaceholder('e.g. Click the button below and Moderators will assist you.')
                        .setRequired(true)
                ),
                new Discord.ActionRowBuilder().addComponents(
                    new Discord.TextInputBuilder()
                        .setCustomId('ticket-interface-btn')
                        .setLabel("The displayed text of ticket creation button.")
                        .setStyle(Discord.TextInputStyle.Short)
                        .setMaxLength(32)
                        .setMinLength(4)
                        .setPlaceholder('e.g. 🎫 Create a ticket')
                        .setRequired(true)
                ),
                new Discord.ActionRowBuilder().addComponents(
                    new Discord.TextInputBuilder()
                        .setCustomId('ticket-moderator-role-id')
                        .setLabel("The role id(s) of moderators. (Optional)")
                        .setStyle(Discord.TextInputStyle.Paragraph)
                        // .setMaxLength(16)
                        .setMinLength(4)
                        .setPlaceholder('@Moderator role id(s).\nIf you have multiple roles to be notified, separate them by a comma `,`')
                        .setRequired(false)
                )
            );

        await interaction.showModal(modal);
    },
};
