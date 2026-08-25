const Discord = require('discord.js');
const { client } = require('#assets/library/state.js');
const memory = require('#assets/api/memory.api.js');

module.exports.exec = async (interaction) => {
    const title = interaction.fields.getTextInputValue('ticket-interface-title'),
        desc = interaction.fields.getTextInputValue('ticket-interface-desc'),
        btn = interaction.fields.getTextInputValue('ticket-interface-btn'),
        modtmp = interaction.fields.getTextInputValue('ticket-moderator-role-id') ?? null;

    const mod = (modtmp ? modtmp.split(',').filter(str => str !== "") : null);

    const UUID = await memory.setData({
        "ticket-interface-title": title,
        "ticket-interface-desc": desc,
        "ticket-interface-btn": btn,
        "ticket-moderator-role-id": mod
    }, 1000 * 15 * 60);

    let sentMessage = "Your public interface will look like this (Accept button will not be shown).";
    if (mod)
        sentMessage += `\nI will ping ${mod.listing("<@&", ">", ", ")} when a ticket is created.`;
    sentMessage += "\nIf you accept this modal, click Accept within 15 minutes, else you can safely click `Dimiss message`.";

    await interaction.reply({
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
                        .setCustomId(`ticket:BUTTON:moderation/dummy:${0}`)

                ).addComponents(
                    new Discord.ButtonBuilder()
                        .setLabel("Accept this modal")
                        .setStyle(Discord.ButtonStyle.Success)
                        .setCustomId(`ticket:BUTTON:moderation/accept:${UUID}`)

                )
        ],
        ephemeral: true
    });
}
