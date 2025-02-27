
const Discord = require('discord.js');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('ping')
        .setDescription('Reply Ponk!.')
    ,
    async execute(interaction) {
        interaction.reply(`Ponk \`${Math.abs(interaction.createdTimestamp - new Date().getTime())}\`ms`);
    },
};
