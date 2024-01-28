const ping = require('ping');
const Discord = require('discord.js');
const dirname = global.dirname;
const stdlib = global.stdlib;

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check if the BOT is dead or not.'),
    async execute(interaction) {
        await interaction.reply("Pong!").then(thismsg => thismsg.edit(`Pong! \`${new Date().getTime() - interaction.createdTimestamp}ms\``));
    },
};
