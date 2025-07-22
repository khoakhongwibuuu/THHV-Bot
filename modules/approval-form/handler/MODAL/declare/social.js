const { memory } = global.customLib;

module.exports.exec = async (interaction, UUID) => {
    const data = memory.getData(UUID);
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
        await require('./../../BUTTON/declare/display-page2').exec(data.host, UUID, data.host.message, false, interaction);
    }
}