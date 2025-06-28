// Packages
const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');
const memory = require(path.join(global.dirname, 'assets/api/memory.api.js'));

let guildTickets = {};
/* IN-MEMORY STORAGE
guildTickets = {
    "guild-id-1": {
        "rootChannel": channelId,
        "rootCategory" : categoryId,
        "running" : {
            "ticket-channel-id-1": ticket-creator-id-1,
            "ticket-channel-id-2": ticket-creator-id-2,
            ...
        }
    },
    "guild-id-2": {
        "root-channel": channelId,
        "root-category" : categoryId,
        "running" : {
            "ticket-channel-id-1": ticket-creator-id-1,
            "ticket-channel-id-2": ticket-creator-id-2,
            ...
        }
    },
    ...
}
*/

const getGuildFilePath = (guildId) =>
    path.join(global.dirname, 'modules/ticket/config', `${guildId}.json`);

const isSetup = (guildId) =>
    guildTickets.hasOwnProperty(guildId);


// File operations
const loadGuildFile = (guildId) =>
    JSON.parse(fs.readFileSync(getGuildFilePath(guildId)));


const writeGuildFile = (guildId, newData) =>
    fs.writeFileSync(getGuildFilePath(guildId), JSON.stringify(newData), 'utf8');

// Module startup
const preLoad = (guildId) => {
    const guildData = loadGuildFile(guildId);
    guildTickets[guildId] = guildData;
}

// (un)installation
const guildSetup = (guildId, rootChannelId, rootCategoryID) => {
    if (!isSetup(guildId)) {
        guildTickets[guildId] = {};
        guildTickets[guildId].rootChannel = rootChannelId;
        guildTickets[guildId].rootCategory = rootCategoryID;
        guildTickets[guildId].running = {};
        writeGuildFile(guildId, guildTickets[guildId]);
    }
}

const getRootChannel = (guildId) =>
    isSetup(guildId) ? guildTickets[guildId].rootChannel : null;

const handleCreateTicketBtnInteraction = (interaction) => {
    if (Object.values(guildTickets[interaction.guild.id].running).includes(interaction.user.id)) {
        interaction.reply({
            ephemeral: true,
            content: "You cannot have more than 1 ticket open at the same time."
                + "\nPlease close your existing ticket to start a new one."
        });
        return;
    }

    interaction.reply({
        content: "Please wait while the ticket is being created.",
        ephemeral: true
    }).then(message => setTimeout(() => message.delete(), 1000));

    global.discordAPI.Guild(interaction.guild.id).channels.create({
        name: `🎫-ticket-${interaction.user.username}`,
        type: Discord.ChannelType.GuildText,
        parent: interaction.channel.parentId, permissionOverwrites: [
            {
                id: interaction.guild.roles.everyone.id,
                deny: [Discord.PermissionFlagsBits.ViewChannel]
            },
            {
                id: interaction.user.id,
                allow: [Discord.PermissionFlagsBits.ViewChannel]
            }
        ]
    }).then(channel => {
        guildTickets[interaction.guild.id].running[channel.id] = interaction.user.id;
        writeGuildFile(interaction.guild.id, guildTickets[interaction.guild.id]);

        channel.send({
            content: `<@${interaction.user.id}>`,
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
                            .setCustomId(`destroyTicket-${interaction.user.id}`)
                    )
            ]
        }).then(message => {
            message.edit({
                content: ""
            });
        });
    });
}

const handleAcceptTicketBtnInteraction = (interaction) => {
    const UUID = interaction.customId.slice(interaction.customId.lastIndexOf(':') + 1);
    const data = memory.getData(UUID);

    const channelId = interaction.channel.id;
    const guildId = interaction.guild.id;

    if (!data) {
        interaction.reply({
            ephemeral: true,
            content: isSetup(guildId)
                ? "Ticket interface has been broadcasted before, this button is no longer usable."
                : "Your 15-minute decision time is up. Please click `Dimiss message` and use `/ticket-setup` again."
        });
    } else {
        memory.deleteData(UUID);

        const broadcastChannel = global.discordAPI.GuildChannel(guildId, channelId);
        const categoryId = broadcastChannel.parentId;

        guildTickets[guildId] = {
            "rootChannel": channelId,
            "rootCategory": categoryId,
            "running": {}
        }

        writeGuildFile(guildId, guildTickets[guildId]);

        interaction.reply({
            ephemeral: true,
            content: "Ticket interface has been broadcasted, you can safely click `Dimiss message` now."
        }).then(message => setTimeout(() => message.delete(), 1000));
        broadcastChannel.send({
            embeds: [new Discord.EmbedBuilder()
                .setTitle(data['ticket-interface-title'])
                .setDescription(data['ticket-interface-desc'])
                .setColor(0xf6630d)
                .setFooter({
                    text: "Powered by Ticket module.",
                    iconURL: global.client.user.avatarURL()
                })

            ],
            components: [
                new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setLabel(data['ticket-interface-btn'])
                            .setStyle(Discord.ButtonStyle.Primary)
                            .setCustomId(`createTicket-${guildId}-${categoryId}-${channelId}`)
                    )
            ],
            ephemeral: false
        });
    }
}

const handleDumpedTicketBtnInteraction = (interaction) => {
    interaction.reply({
        content: "This Ticket create button is just an example.",
        ephemeral: true
    });
}

const handleTicketSetupModal = (interaction) => {
    const UUID = memory.setData({
        "ticket-interface-title": interaction.fields.getTextInputValue('ticket-interface-title'),
        "ticket-interface-desc": interaction.fields.getTextInputValue('ticket-interface-desc'),
        "ticket-interface-btn": interaction.fields.getTextInputValue('ticket-interface-btn')
    }, 1000 * 15 * 60);
    interaction.reply({
        content: "Your public interface will look like this (Accept button will not be shown)."
            + "\nIf you accept this modal, click Accept within 15 minutes, else you can safely click `Dimiss message`.",
        embeds: [
            new Discord.EmbedBuilder()
                .setTitle(interaction.fields.getTextInputValue('ticket-interface-title'))
                .setDescription(interaction.fields.getTextInputValue('ticket-interface-desc'))
                .setColor(0xf6630d)
                .setFooter({
                    text: "Powered by Ticket module.",
                    iconURL: global.client.user.avatarURL()
                })

        ],
        components: [
            new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setLabel(interaction.fields.getTextInputValue('ticket-interface-btn'))
                        .setStyle(Discord.ButtonStyle.Primary)
                        .setCustomId("exampleCreateTicket")

                ).addComponents(
                    new Discord.ButtonBuilder()
                        .setLabel("Accept this modal")
                        .setStyle(Discord.ButtonStyle.Success)
                        .setCustomId(`ticket-create-AC:${UUID}`)

                )
        ],
        ephemeral: true
    });
}

const handleClosedTicketBtnInteraction = (interaction) => {
    if (!global.discordAPI.isModerator(interaction.guild.id, interaction.user.id) && interaction.user.id !== guildTickets[interaction.guild.id].running[interaction.channel.id]) {
        interaction.reply({
            ephemeral: true,
            content: "Sorry, you do not have permission to close this ticket."
        });
    } else {
        interaction.channel.delete();
        delete guildTickets[interaction.guild.id].running[interaction.channel.id];
        writeGuildFile(interaction.guild.id, guildTickets[interaction.guild.id]);
    }
}

module.exports = {
    getGuildFilePath,
    isSetup,
    loadGuildFile,
    writeGuildFile,
    preLoad,
    guildSetup,
    getRootChannel,
    handleCreateTicketBtnInteraction,
    handleAcceptTicketBtnInteraction,
    handleDumpedTicketBtnInteraction,
    handleClosedTicketBtnInteraction,
    handleTicketSetupModal
}