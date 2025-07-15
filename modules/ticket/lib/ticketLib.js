// Packages
const fs = require('node:fs');
const path = require('node:path');
const Discord = require('discord.js');
const { dirname, client } = global.variable;
const { memory, discordAPI } = global.customLib;

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
    path.join(dirname, 'modules/ticket/config', `${guildId}.json`);

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

const guildReset = (guildId) => {
    if (!isSetup(guildId)) return false;
    delete guildTickets[guildId];
    fs.unlinkSync(getGuildFilePath(guildId));
    return true;
}

const getRootChannel = (guildId) =>
    isSetup(guildId) ? guildTickets[guildId].rootChannel : null;

const getExistingTickets = (guildId) =>
    isSetup(guildId) ? Object.keys(guildTickets[guildId].running) : [];

const handleCreateTicketBtnInteraction = (interaction) => {
    if (!isSetup(interaction.guild.id)) {
        interaction.reply({
            ephemeral: true,
            content: "This server ticket profile has been uninstalled before."
                + "\nYou cannot start a ticket."
        });
        return;
    }

    if (Object.values(guildTickets[interaction.guild.id].running).includes(interaction.user.id)) {
        interaction.reply({
            ephemeral: true,
            content: "You cannot have more than 1 ticket open at the same time."
                + "\nPlease close your existing ticket to start a new one."
        });
        return;
    }

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

    if (guildTickets[interaction.guild.id].modRoles) {
        guildTickets[interaction.guild.id].modRoles.forEach(id => {
            overrideSetting.push({
                id: id,
                allow: DEFAULT_TICKET_PERM_ALLOW
            });
        });
    }

    discordAPI.Guild(interaction.guild.id).channels.create({
        name: `🎫-ticket-${interaction.user.username}`,
        type: Discord.ChannelType.GuildText,
        parent: interaction.channel.parentId, permissionOverwrites: overrideSetting
    }).then(channel => {
        guildTickets[interaction.guild.id].running[channel.id] = interaction.user.id;
        writeGuildFile(interaction.guild.id, guildTickets[interaction.guild.id]);
        interaction.reply({
            ephemeral: true,
            content: `Successfully created <#${channel.id}> for you.`
        });
        let ticketInitMessage = `<@${interaction.user.id}>`;
        if (guildTickets[interaction.guild.id].modRoles)
            ticketInitMessage += `,${guildTickets[interaction.guild.id].modRoles.argList("role-mention")}`
        channel.send({
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
                            .setCustomId(`destroyTicket`)
                    )
            ]
        })
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

        const broadcastChannel = discordAPI.GuildChannel(guildId, channelId);
        const categoryId = broadcastChannel.parentId;

        guildTickets[guildId] = {
            "rootChannel": channelId,
            "rootCategory": categoryId,
            "modRoles": data['ticket-moderator-role-id'],
            "running": {}
        }

        writeGuildFile(guildId, guildTickets[guildId]);

        interaction.reply({
            ephemeral: true,
            content: "Ticket interface has been broadcasted, you can safely click `Dimiss message` now."
        })
        // .then(message => setTimeout(() => message.delete(), 1000));
        broadcastChannel.send({
            embeds: [new Discord.EmbedBuilder()
                .setTitle(data['ticket-interface-title'])
                .setDescription(data['ticket-interface-desc'])
                .setColor(0xf6630d)
                .setFooter({
                    text: "Powered by Ticket module.",
                    iconURL: client.user.avatarURL()
                })

            ],
            components: [
                new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setLabel(data['ticket-interface-btn'])
                            .setStyle(Discord.ButtonStyle.Primary)
                            .setCustomId(`createTicket`)
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
    const title = interaction.fields.getTextInputValue('ticket-interface-title'),
        desc = interaction.fields.getTextInputValue('ticket-interface-desc'),
        btn = interaction.fields.getTextInputValue('ticket-interface-btn'),
        modtmp = interaction.fields.getTextInputValue('ticket-moderator-role-id') ?? null;

    const mod = (modtmp ? modtmp.split(',').filter(str => str !== "") : null);

    const UUID = memory.setData({
        "ticket-interface-title": title,
        "ticket-interface-desc": desc,
        "ticket-interface-btn": btn,
        "ticket-moderator-role-id": mod
    }, 1000 * 15 * 60);

    let sentMessage = "Your public interface will look like this (Accept button will not be shown).";
    if (mod)
        sentMessage += `\nI will ping ${mod.argList("role-mention")} when a ticket is created.`;
    sentMessage += "\nIf you accept this modal, click Accept within 15 minutes, else you can safely click `Dimiss message`.";

    interaction.reply({
        content: sentMessage,
        embeds: [
            new Discord.EmbedBuilder()
                .setTitle(interaction.fields.getTextInputValue('ticket-interface-title'))
                .setDescription(interaction.fields.getTextInputValue('ticket-interface-desc'))
                .setColor(0xf6630d)
                .setFooter({
                    text: "Powered by Ticket module.",
                    iconURL: client.user.avatarURL()
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
    interaction.channel.delete();
    delete guildTickets[interaction.guild.id].running[interaction.channel.id];
    writeGuildFile(interaction.guild.id, guildTickets[interaction.guild.id]);
}

module.exports = {
    getGuildFilePath,
    isSetup,
    loadGuildFile,
    writeGuildFile,
    preLoad,
    guildSetup,
    guildReset,
    getRootChannel,
    getExistingTickets,
    handleCreateTicketBtnInteraction,
    handleAcceptTicketBtnInteraction,
    handleDumpedTicketBtnInteraction,
    handleClosedTicketBtnInteraction,
    handleTicketSetupModal
}