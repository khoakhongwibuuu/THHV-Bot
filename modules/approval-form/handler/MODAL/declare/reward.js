const { memory } = global.customLib;

module.exports.exec = async (interaction, UUID) => {
    const data = memory.getData(UUID);
    if (data) {
        data.rewards.VOI = interaction.fields.getTextInputValue('voi') ?? null;
        data.rewards.others = interaction.fields.getTextInputValue('others') ?? null;
        data.notes = interaction.fields.getTextInputValue('notes') ?? null;
        await require('./../../BUTTON/declare/display-page3').exec(data.host, UUID, data.host.message, false, interaction);
    }
}