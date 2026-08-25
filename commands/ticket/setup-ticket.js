// Packages
const Discord = require('discord.js');
const ticketLib = require('#modules/ticket/lib/ticketLib.js');
const discordAPI = require('#assets/api/discord.api.js');
const discordAPIv2 = require('#assets/api/discord.api.v2.js');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('ticket-setup')
        .setDescription('[Admin Only] - Setup ticket init channel.')
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
        if (await ticketLib.isSetup(interaction.guild.id)) {
            await interaction.reply({
                content: `⚠️ Ticket module has been installed at <#${await ticketLib.getRootChannel(interaction.guild.id)}>.`,
                ephemeral: true
            });
            return;
        }
        if (interaction.channel.isThread()) {
            await interaction.reply({
                content: "⚠️ This command is not intended for thread channel uses.",
                ephemeral: true
            });
            return;
        }
        if (interaction.channel.isVoiceBased()) {
            await interaction.reply({
                content: "⚠️ This command is not intended for voice channel uses.",
                ephemeral: true
            });
            return;
        }
        const categoryId = interaction.channel?.parentId ?? null;
        if (!categoryId) {
            await interaction.reply({
                content: "⚠️ This channel does not belong to any category.",
                ephemeral: true
            });
            return;
        }

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
                        .setValue('Do you need assistance ?')
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
                        .setValue('Click the button below and Moderators will assist you.')
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
                        .setValue('🎫 Create a ticket')
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
