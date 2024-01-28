const Discord = require('discord.js');
const dirname = global.dirname;
const stdlib = global.stdlib;

const fs = require('fs');
const path = require('path');

const removeTree = (directory, exception) => {
    const realE = exception ?? "none"
    fs.readdir(directory, (err, files) => {
        if (err) throw err;
        for (const file of files) {
            if (file !== exception) {
                fs.unlink(path.join(directory, file), err => {
                    if (err) throw err;
                });
            }
        }
    });
}

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('clean')
        .setDescription('[ADMIN ONLY] - Clean.')
        .addStringOption(option =>
            option.setName('mode')
                .setDescription('Choose which to be deleted.')
                .setRequired(true)
                .addChoices(
                    { name: 'Log', value: 'log' },
                ))
    ,
    async execute(interaction) {
        const coreLib = require(dirname + '/assets/library/core.js');
        const config = coreLib.load();
        const serverLib = require(dirname + '/assets/library/server.js');
        const server = serverLib.load();
        if (interaction.user.id === config.owner || config.trusted.includes(interaction.user.id)) {
            if (interaction.channelId == server.panel) {
                const mode = interaction.options.getString('mode');
                if (mode === "log") {
                    const e = global.BotStartTime.replace(/:/g, "") + '.log';
                    removeTree("logs", e);
                }
                interaction.reply({
                    content: "Task finished.",
                    ephemeral: true
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
