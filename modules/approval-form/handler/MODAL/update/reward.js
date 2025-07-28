const { memory } = global.customLib;

module.exports.exec = async (interaction, UUID) => {
    const data = memory.getData(UUID);
    if (data) {
        data.rewards.VOI = interaction.fields.getTextInputValue('voi')
            ? interaction.fields.getTextInputValue('voi').sanitise()
            : null;
        data.rewards.others = interaction.fields.getTextInputValue('others')
            ? interaction.fields.getTextInputValue('others').sanitise()
            : null;
        data.notes = interaction.fields.getTextInputValue('notes')
            ? interaction.fields.getTextInputValue('notes').sanitise()
            : null;
        await require('./../../BUTTON/update/display-page2').exec(data.host, UUID, data.host.message, false, interaction);
    }
}