const { SlashCommandBuilder } = require('discord.js');
const dirname = global.dirname;
const stdlib = global.stdlib;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shutdown')
        .setDescription('Turn off the bot.'),
    async execute(interaction) {
        const coreLib = require(dirname + '/assets/library/core.js');
        const config = coreLib.load();
        if (interaction.user.id === config.owner || config.trusted.includes(interaction.user.id)) {
            interaction.reply({
                content: "The bot has stopped working!",
                ephemeral: true
            });
            const now = new Date().toISOString();
            (`Bot was shut down manually at ${now} by ${interaction.user.id}`).logToFile(global.BotStartTime);
            setTimeout(() => process.exit(1), 1500);
        } else {
            interaction.reply({
                content: "You do not have permission to run this command.",
                ephemeral: true
            });
        }
    },
};
