// Packages
const Discord = require('discord.js');
const { contestLib } = global.customLib;

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('unsetnotify')
        .setDescription('[Hosts Only] - Reset every configured notification instances.')
        .setDMPermission(false)
    ,
    async execute(interaction) {
        if (process.env.OWNER_ID === interaction.user.id) {
            await contestLib.wipePersist();
            await interaction.reply({
                content: `Persist has been reseted.`,
                ephemeral: true
            });
        } else {
            await interaction.reply({
                content: "🚫 You do not have permission to run this command.",
                ephemeral: true
            });
        }
    },
};
