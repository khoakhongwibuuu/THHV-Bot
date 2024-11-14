const Discord = require('discord.js');
const dirname = global.dirname;
const stdlib = global.stdlib;
const discordAPI = global.discordAPI;

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('shutdown')
        .setDescription('[Admins Only] - Turn off the bot.')
        .setDMPermission(false)
    ,
    async execute(interaction) {
        if (process.env.OWNER_ID === interaction.user.id || discordAPI.isAdmin(interaction.guild.id, interaction.user.id)) {
            interaction.reply({
                content: "The bot has stopped working!",
                ephemeral: true
            });

            (`[${new Date().toISOString()}] [WARNING] Bot was shut down manually by ${interaction.user.id} (${interaction.user.username})`).logOffline();
            setTimeout(() => process.exit(1), 1500);
        } else {
            interaction.reply({
                content: "You do not have permission to run this command.",
                ephemeral: true
            });
        }
    },
};
