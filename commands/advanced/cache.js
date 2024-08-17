
const Discord = require('discord.js');
const dirname = global.dirname;
const stdlib = global.stdlib;
const coreLib = global.coreLib;
const discordAPI = global.discordAPI;

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('clear-cache')
        .setDescription('Clear bot cache.'),
    async execute(interaction) {
        const config = coreLib.load();

        if (interaction.user.id === config.owner || discordAPI.isAdmin(interaction.guild.id, interaction.user.id)) {
            stdlib.clearCache(global.BotStartTime.replace(/:/g, ""));
            interaction.reply({
                content: "Cache cleared!",
                ephemeral: true
            });

        } else {
            interaction.reply({
                content: "You do not have permission to run this command.",
                ephemeral: true
            });
        }
    },
};
