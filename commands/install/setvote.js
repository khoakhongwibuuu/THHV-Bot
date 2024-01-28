const fs = require('fs');
const Discord = require('discord.js');
const dirname = global.dirname;
const stdlib = global.stdlib;

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('setvote')
        .setDescription('[ADMIN ONLY] - Set voting channel.'),
    async execute(interaction) {
        const coreLib = require(dirname + '/assets/library/core.js');
        const serverLib = require(dirname + '/assets/library/server.js');
        const server = serverLib.load();
        const config = coreLib.load();
        if (interaction.user.id === config.owner || config.trusted.includes(interaction.user.id)) {
            server['suggest'] = interaction.channel.id;
            fs.writeFileSync(dirname + '/configs/server.json', JSON.stringify(server, null, 4));
            interaction.reply({
                content: "Voting channel has been set.",
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
