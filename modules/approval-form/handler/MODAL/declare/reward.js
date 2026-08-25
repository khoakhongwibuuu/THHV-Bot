const memory = require('#assets/api/memory.api.js');

module.exports.exec = async (interaction, UUID) => {
    const data = await memory.getData(UUID);
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
        await require('./../../BUTTON/declare/display-page3').exec(data.host, UUID, data.host.message, false, interaction);
    }
}
