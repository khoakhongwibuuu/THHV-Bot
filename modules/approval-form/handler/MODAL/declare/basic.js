const memory = require('#assets/api/memory.api.js');

module.exports.exec = async (interaction, UUID) => {
    const data = await memory.getData(UUID);
    if (data) {
        data.basic.fullName = interaction.fields.getTextInputValue('fullName')
            ? interaction.fields.getTextInputValue('fullName').sanitise()
            : null;
        data.basic.schoolYear = interaction.fields.getTextInputValue('schoolYear')
            ? interaction.fields.getTextInputValue('schoolYear').sanitise()
            : null;
        await data.host.message.fetch();
        await require('./../../BUTTON/declare/display-page1').exec(data.host, UUID, data.host.message, false, false, interaction);
    }
}
