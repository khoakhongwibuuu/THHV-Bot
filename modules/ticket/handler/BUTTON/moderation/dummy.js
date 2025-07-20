module.exports.exec = async (interaction) => {
    await interaction.reply({
        content: "This Ticket create button is just an example.",
        ephemeral: true
    });
}