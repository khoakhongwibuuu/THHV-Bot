const Discord = require('discord.js');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('shutdown')
        .setDescription('[Hosts Only] - Remotely turn off the bot.')
    ,
    async execute(interaction) {
        if (process.env.OWNER_ID === interaction.user.id) {
            interaction.reply({
                content: "The bot has stopped working!",
                ephemeral: true
            });

            console.log(`[${new Date().toISOString()}] [WARNING] Bot was shut down manually by ${interaction.user.id} (${interaction.user.username})`);
            setTimeout(() => process.exit(1), 1500);
        } else {
            interaction.reply({
                content: "You do not have permission to run this command.",
                ephemeral: true
            });
        }
    },
};
