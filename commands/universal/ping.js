// Packages
const Discord = require('discord.js');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('ping')
        .setDescription('Reply Ponk!.')
    ,
    async execute(interaction) {
        const startTime = Date.now();
        await interaction.reply(`Sending ping request.`);
        const endTime = Date.now();
        setTimeout(async () => {
            await interaction.editReply(`Received in \`${endTime - startTime}\`ms`);
        }, endTime - startTime);
    },
};
