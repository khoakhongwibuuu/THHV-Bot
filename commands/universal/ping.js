
const Discord = require('discord.js');
const dirname = global.dirname;
const stdlib = global.stdlib;
const discordAPI = global.discordAPI;

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('ping')
        .setDescription('Reply Ponk!.')
        .setDMPermission(false)
    ,
    async execute(interaction) {
        interaction.reply(`Ponk \`${Math.abs(interaction.createdTimestamp - new Date().getTime())}\`ms`);
    },
};
