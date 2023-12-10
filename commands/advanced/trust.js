const { SlashCommandBuilder } = require('discord.js');
const dirname = global.dirname;
const stdlib = global.stdlib;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('trust')
        .setDescription('[DEVELOPER ONLY] - Grant authorisation from a user.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user')
                .setRequired(true)),
    async execute(interaction) {
        const coreLib = require(dirname + '/assets/library/core.js');
        const config = coreLib.load();
        if (interaction.user.id === config.owner) {
            const userID = interaction.options.get('target').value;
            if (userID === config.owner || config.trusted.includes(userID)) {
                interaction.reply({
                    content: "This command is not avaiable for that user.",
                    ephemeral: true
                });
            } else {
                coreLib.trust(userID);
                interaction.reply({
                    content: `Successfully added <@${userID}> to trusted members.`,
                    ephemeral: true
                });
            }
        } else {
            interaction.reply({
                content: "You do not have permission to run this command.",
                ephemeral: true
            });
        }
    },
};
