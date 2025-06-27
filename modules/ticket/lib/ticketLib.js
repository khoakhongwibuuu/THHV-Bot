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
            "ticket-id-1": ticket.ticketInstance(user.id),
            "ticket-id-2": ticket.ticketInstance(user.id),
            ...
        }
    },
    "guild-id-2": {
        "root-channel": channelId,
        "root-category" : categoryId,
        "running" : {
            "ticket-id-1": ticket.ticketInstance(user.id),
            "ticket-id-2": ticket.ticketInstance(user.id),
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
    // when non-mods members use button to create ticket
    interaction.reply({
        ephemeral: true,
        content: interaction.customId
    });
}

const handleAcceptTicketBtnInteraction = (interaction) => {
    const UUID = interaction.customId.slice(interaction.customId.lastIndexOf(':') + 1);
    const data = memory.getData(UUID);
    memory.deleteData(UUID);

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

        const broadcastChannel = global.discordAPI.GuildChannel(guildId, channelId);
        const categoryId = broadcastChannel.parentId;

        guildTickets[guildId] = {
            "rootChannel": channelId,
            "rootCategory": categoryId,
            "running": {}
        }

        writeGuildFile(guildId,  guildTickets[guildId]);

        interaction.reply({
            ephemeral: true,
            content: "Ticket interface has been broadcasted, you can safely click `Dimiss message` now."
        });
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
        content: "Your public interface will look like this (Accept button will not be shown).\nIf you accept this modal, click Accept within 15 minutes, else you can safely click `Dimiss message`.",
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

                ),
            new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setLabel("Accept this modal")
                        .setStyle(Discord.ButtonStyle.Success)
                        .setCustomId(`ticket-create-AC:${UUID}`)

                ),
        ],
        ephemeral: true
    });
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
    handleTicketSetupModal
}