const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const dirname = global.dirname;
const stdlib = global.stdlib;

const Persist = JSON.parse(fs.readFileSync(dirname + '/configs/persist.json', 'utf8'));
const savePersist = () => { fs.writeFileSync(dirname + '/configs/persist.json', JSON.stringify(Persist)); }

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setnotify')
        .setDescription('[DEVELOPER ONLY] - Set notification channel.'),
    async execute(interaction) {
        const coreLib = require(dirname + '/assets/library/core.js');
        const serverLib = require(dirname + '/assets/library/server.js');
        const server = serverLib.load();
        const config = coreLib.load();
        if (interaction.user.id === config.owner || config.trusted.includes(interaction.user.id)) {
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
