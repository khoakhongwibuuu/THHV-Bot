module.exports.exec = async (interaction, UUID) => {
    try {
        const channelId = interaction.channelId;
        const messageId = interaction.message.id;

        const channel = await interaction.client.channels.fetch(channelId);
        if (!channel) return;

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