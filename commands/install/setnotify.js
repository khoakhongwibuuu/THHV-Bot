const fs = require('fs');
const Discord = require('discord.js');
const dirname = global.dirname;
const stdlib = global.stdlib;
const coreLib = global.coreLib;
const discordAPI = global.discordAPI;

const Persist = JSON.parse(fs.readFileSync(dirname + '/configs/persist.json', 'utf8'));
const savePersist = () => { fs.writeFileSync(dirname + '/configs/persist.json', JSON.stringify(Persist)); }

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('setnotify')
        .setDescription('Set Codeforces contests notification channel.'),
    async execute(interaction) {
        const config = coreLib.load();
        if (interaction.user.id === config.owner || config.trusted.includes(interaction.user.id) || discordAPI.isModerator(interaction.guild.id, interaction.user.id)) {
            Persist.channel[interaction.guild.id] = interaction.channel.id;
            Persist.ready[interaction.guild.id] = true;
            savePersist();
            interaction.reply({
                content: "Notification channel has been set.",
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
