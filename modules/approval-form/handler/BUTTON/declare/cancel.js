const { memory, formLib } = global.customLib;

module.exports.exec = async (interaction, UUID) => {
    const data = memory.getData(UUID);
    memory.deleteData(UUID);
    formLib.removeMemberFromCache(data.guildId, interaction.user.id);
    interaction.message.delete();
}