const Discord = require('discord.js');
const { formLib, memory, discordAPI } = global.customLib;
const { client } = global.variable;

module.exports.exec = async (interaction, UUID) => {
    const data = memory.getData(UUID);
    if (data) {
        data.basic.fullName = interaction.fields.getTextInputValue('fullName') ?? null;
        data.basic.schoolYear = interaction.fields.getTextInputValue('schoolYear') ?? null;
        await data.host.message.fetch();
        await require('./../../BUTTON/declare/display-page1').exec(data.host, UUID, data.host.message, false, false, interaction);
    }
}