const memory = require('#assets/api/memory.api.js');

module.exports.exec = async (interaction, UUID) => {
    const data = await memory.getData(UUID);
    if (data) {
        data.social.Email = interaction.fields.getTextInputValue('email')
            ? interaction.fields.getTextInputValue('email').sanitise()
            : null;
        data.social.Codeforces = interaction.fields.getTextInputValue('codeforces')
            ? interaction.fields.getTextInputValue('codeforces').sanitise()
            : null;
        data.social.VNOI = interaction.fields.getTextInputValue('vnoi')
            ? interaction.fields.getTextInputValue('vnoi').sanitise()
            : null;
        await require('./../../BUTTON/update/display-page1').exec(data.host, UUID, data.host.message, false, false, interaction);
    }
}
