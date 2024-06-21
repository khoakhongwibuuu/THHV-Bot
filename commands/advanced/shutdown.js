const Discord = require('discord.js');
const dirname = global.dirname;
const stdlib = global.stdlib;
const coreLib = global.coreLib;

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('shutdown')
        .setDescription('Turn off the bot.'),
    async execute(interaction) {
        const config = coreLib.load();
        if (interaction.user.id === config.owner || config.trusted.includes(interaction.user.id)) {
            interaction.reply({
                content: "The bot has stopped working!",
                ephemeral: true
            });
            const now = new Date().toISOString();
            (`[${new Date().toISOString()}] [WARNING] Bot was shut down manually by ${interaction.user.id} (${interaction.user.username})`).logE();
            setTimeout(() => process.exit(1), 1500);
        } else {
            interaction.reply({
                content: "You do not have permission to run this command.",
                ephemeral: true
            });
        }
    },
};
