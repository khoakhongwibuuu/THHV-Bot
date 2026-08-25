const ticketLib = require('#modules/ticket/lib/ticketLib.js');

module.exports.exec = async (interaction) => {
    await ticketLib.removeOccupation(interaction.guild.id, interaction.channel.id);
    await interaction.channel.delete();
}
