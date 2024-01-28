const Discord = require('discord.js');
const dirname = global.dirname;
const stdlib = global.stdlib;

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('inspect')
        .setDescription('[ADMIN ONLY] - Inspect permission data.')
    ,
    async execute(interaction) {
        const coreLib = require(dirname + '/assets/library/core.js');
        const config = coreLib.load();
        const serverLib = require(dirname + '/assets/library/server.js');
        const server = serverLib.load();
        if (interaction.user.id === config.owner || config.trusted.includes(interaction.user.id)) {
            if (interaction.channelId == server.panel) {
                const ownerID = config.owner;
                const trustedIDs = config.trusted;
                const sentEmbed = new Discord.EmbedBuilder();
                sentEmbed.setTitle(`Authorised members.\n`)
                let content = `**Bot owner**\n* <@${ownerID}>\n**Other authorised members**\n`;
                trustedIDs.forEach(e => {
                    content += `* <@${e}>\n`
                });
                sentEmbed.setDescription(content);
                interaction.reply({
                    embeds: [sentEmbed],
                    ephemeral: false
                });
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
