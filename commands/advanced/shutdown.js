const Discord = require('discord.js');
const dirname = global.dirname;
const stdlib = global.stdlib;

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('shutdown')
        .setDescription('[ADMIN ONLY] - Turn off the bot.'),
    async execute(interaction) {
        const coreLib = require(dirname + '/assets/library/core.js');
        const config = coreLib.load();
        const serverLib = require(dirname + '/assets/library/server.js');
        const server = serverLib.load();
        if (interaction.user.id === config.owner || config.trusted.includes(interaction.user.id)) {
            if (interaction.channelId == server.panel) {
                interaction.reply({
                    content: "The bot has stopped working!",
                    ephemeral: true
                });
                const now = new Date().toISOString();
                (`[${new Date().toISOString()}] [WARNING] Bot was shut down manually by ${interaction.user.id} (${interaction.user.username})`).logE();
                setTimeout(() => process.exit(1), 1500);
            } else {
                if (server.panel == "") {
                    interaction.reply({
                        content: "Access to this high-risk command is blocked. The server control panel is not configured.",
                        ephemeral: true
                    });
                } else {
                    interaction.reply({
                        content: `This command must be used inside <#${server.panel}>.`,
                        ephemeral: true
                    });
                }
            }
        } else {
            interaction.reply({
                content: "You do not have permission to run this command.",
                ephemeral: true
            });
        }
    },
};
