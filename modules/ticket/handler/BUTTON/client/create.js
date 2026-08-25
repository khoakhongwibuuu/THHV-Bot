const Discord = require('discord.js');
const ticketLib = require('#modules/ticket/lib/ticketLib.js');
const discordAPI = require('#assets/api/discord.api.js');
const discordAPIv2 = require('#assets/api/discord.api.v2.js');

const DEFAULT_TICKET_PERM_ALLOW = [
    Discord.PermissionFlagsBits.ViewChannel,
    Discord.PermissionFlagsBits.AddReactions,
    Discord.PermissionFlagsBits.SendMessages,
    Discord.PermissionFlagsBits.SendTTSMessages,
    Discord.PermissionFlagsBits.EmbedLinks,
    Discord.PermissionFlagsBits.AttachFiles,
    Discord.PermissionFlagsBits.ReadMessageHistory,
    Discord.PermissionFlagsBits.UseExternalEmojis,
    Discord.PermissionFlagsBits.UseApplicationCommands,
    Discord.PermissionFlagsBits.UseExternalStickers
];

module.exports.exec = async (interaction) => {
    if (!await ticketLib.isSetup(interaction.guild.id)) {
        await interaction.reply({
            ephemeral: true,
            content: "This server ticket profile has been uninstalled before."
                + "\nYou cannot start a ticket."
        });
        return;
    }

    if (await ticketLib.isOccupied(interaction.guild.id, interaction.user.id)) {
        await interaction.reply({
            ephemeral: true,
            content: "You cannot have more than 1 ticket open at the same time."
                + "\nPlease close your existing ticket to start a new one."
        });
        return;
    }

    await interaction.deferReply({ ephemeral: true });

    let overrideSetting = [
        {
            id: interaction.guild.roles.everyone.id,
            deny: [Discord.PermissionFlagsBits.ViewChannel]
        },
        {
            id: interaction.user.id,
            allow: DEFAULT_TICKET_PERM_ALLOW
        }
    ]

    const { modRoles } = await ticketLib.getGuildConfig(interaction.guild.id);

    if (modRoles) {
        modRoles.forEach(id => {
            overrideSetting.push({
                id: id,
                allow: DEFAULT_TICKET_PERM_ALLOW
            });
        });
    }

    const destinationGuild = await discordAPIv2.Guild(interaction.guild.id);

    await destinationGuild.channels.create({
        name: `🎫-ticket-${interaction.user.username}`,
        type: Discord.ChannelType.GuildText,
        parent: interaction.channel.parentId, permissionOverwrites: overrideSetting
    }).then(async (channel) => {
        await ticketLib.addOccupation(interaction.guild.id, channel.id, interaction.user.id);
        await interaction.editReply({
            ephemeral: true,
            content: `Successfully created <#${channel.id}> for you.`
        });
        let ticketInitMessage = `<@${interaction.user.id}>`;
        if (modRoles)
            ticketInitMessage += `,${modRoles.listing("<@&", ">", ", ")}`
        await channel.send({
            content: ticketInitMessage,
            embeds: [
                new Discord.EmbedBuilder()
                    .setTitle("Ticket control panel")
                    .setDescription(
                        `This ticket was created by <@${interaction.user.id}>`
                        + ` at <t:${Math.floor(interaction.createdTimestamp / 1000)}:F>.`
                    )
            ],
            components: [
                new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setLabel("🚫 Close this ticket.")
                            .setStyle(Discord.ButtonStyle.Primary)
                            .setCustomId(`ticket:BUTTON:client/destroy:${0}`)
                    )
            ]
        })
    });
}
