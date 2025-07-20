const { ticketLib } = global.customLib;

module.exports.exec = async (interaction) => {
    ticketLib.removeOccupation(interaction.guild.id, interaction.channel.id);
    await interaction.channel.delete();
}