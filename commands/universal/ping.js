// Packages
const Discord = require('discord.js');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('ping')
        .setDescription('Reply Ponk!.')
    ,
    async execute(interaction) {
        const startTime = Date.now();
        await interaction.reply(`Calculating response time.`);
        const endTime = Date.now();
        setTimeout(async () => {
            await interaction.editReply(`\`${endTime - startTime}\`ms`);
        }, endTime - startTime);
    },
};
