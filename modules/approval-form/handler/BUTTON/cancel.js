const memory = require('#assets/api/memory.api.js');
const formLib = require('#modules/approval-form/lib/formLib.js');

module.exports.exec = async (interaction, UUID) => {
    const data = await memory.getData(UUID);
    if (data && data.guildId && interaction.user.id)
        await formLib.removeMemberFromCache(data.guildId, interaction.user.id);
    await memory.deleteData(UUID);
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
