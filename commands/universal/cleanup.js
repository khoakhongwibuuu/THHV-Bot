// Packages
const Discord = require('discord.js');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('cleanup')
        .setDescription('[Hosts Only] - .')
    ,
    async execute(interaction) {
        if (process.env.OWNER_ID === interaction.user.id) {
            await interaction.reply({
                content: "The bot has stopped working!",
                ephemeral: true
            });

            console.log(`[${new Date().toISOString()}] [WARNING] Bot was shut down automatically during clean up.`);
            setTimeout(() => process.exit(1), 1500);
        } else {
            interaction.reply({
                content: "You do not have permission to run this command.",
                ephemeral: true
            });
        }
    },
};
