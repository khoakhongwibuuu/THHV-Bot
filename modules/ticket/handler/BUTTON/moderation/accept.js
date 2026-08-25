const Discord = require('discord.js');
const { client } = require('#assets/library/state.js');
const ticketLib = require('#modules/ticket/lib/ticketLib.js');
const memory = require('#assets/api/memory.api.js');
const discordAPI = require('#assets/api/discord.api.js');
const discordAPIv2 = require('#assets/api/discord.api.v2.js');

module.exports.exec = async (interaction, UUID) => {
    const data = await memory.getData(UUID);

    const channelId = interaction.channel.id;
    const guildId = interaction.guild.id;

    if (!data) {
        await interaction.reply({
            ephemeral: true,
            content: await ticketLib.isSetup(guildId)
                ? "Ticket interface has been broadcasted before, this button is no longer usable."
                : "Your 15-minute decision time is up. Please click `Dimiss message` and use `/ticket-setup` again."
        });
    } else {
        await memory.deleteData(UUID);

        const broadcastChannel = await discordAPIv2.GuildChannel(guildId, channelId);
        const categoryId = broadcastChannel.parentId;

        await ticketLib.guildSetup(interaction.guild.id, {
            "rootChannel": channelId,
            "rootCategory": categoryId,
            "modRoles": data['ticket-moderator-role-id'],
            "running": {}
        });

        await interaction.reply({
            ephemeral: true,
            content: "Ticket interface has been broadcasted, you can safely click `Dimiss message` now."
        });

        await broadcastChannel.send({
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
                            .setCustomId(`ticket:BUTTON:client/create:${0}`)
                    )
            ],
            ephemeral: false
        });
    }
}
