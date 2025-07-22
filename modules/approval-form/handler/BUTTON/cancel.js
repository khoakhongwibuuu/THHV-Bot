const Discord = require('discord.js');
const { memory, formLib } = global.customLib;

module.exports.exec = async (interaction, UUID) => {
    const data = memory.getData(UUID);
    if (data && data.guildId && interaction.user.id)
        formLib.removeMemberFromCache(data.guildId, interaction.user.id);
    memory.deleteData(UUID);
    try {
        const channelId = interaction.channelId;
        const messageId = interaction.message.id;

        const channel = await interaction.client.channels.fetch(channelId);
        if (!channel || !channel.isDMBased()) return;

        const message = await channel.messages.fetch(messageId);
        await message.delete();
    } catch (err) {
        console.error(err);
        await interaction.reply({
            ephemeral: true,
            content: `Đã có lỗi xảy ra.`
        });
    }
}