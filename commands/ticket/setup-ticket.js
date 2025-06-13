// Packages
const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');

// Module Specified
const ticketLib = require(path.join(global.dirname, 'modules/ticket/lib/ticketLib.js'));
const ticket = require(path.join(global.dirname, 'modules/ticket/lib/ticket.js'));

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('ticket-setup')
        .setDescription('[Moderators Only] - Setup ticket init channel.')
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
        interaction.reply({
            content: "Setting up. Please wait.",
            ephemeral: true
        });
        global.discordAPI.GuildChannel(guildId, channelId).send({
            embeds: [new Discord.EmbedBuilder()
                .setTitle("Bạn cần hỗ trợ ?")
                .setDescription("Hãy ấn vào 📩 bên dưới sẽ có các Moderator hỗ trợ bạn.")
                .setColor(0xf6630d)
                .setFooter({
                    text: "Powered by Ticket module.",
                    iconURL: global.client.user.avatarURL()
                })

            ],
            components: [new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setLabel('📩 Open a ticket!')
                        .setStyle(Discord.ButtonStyle.Success)
                        .setCustomId(`ticket-${guildId}-${categoryId}-${channelId}`)

                )]
        });
    },
};
