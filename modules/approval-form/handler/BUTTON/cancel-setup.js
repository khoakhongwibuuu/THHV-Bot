const { memory } = global.customLib;

module.exports.exec = async (interaction, UUID) => {
    memory.deleteData(UUID);
    interaction.message.delete();
}