const Discord = require('discord.js');
const dirname = global.dirname;
const stdlib = global.stdlib;

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('reset')
        .setDescription('[DEVELOPER ONLY] - Reset specific configuration of the bot.')
        .addSubcommand(subcmd1 =>
            subcmd1
                .setName('memberscore')
                .setDescription('[DEVELOPER ONLY] - Reset score of a specific member.')
                .addUserOption(option =>
                    option
                        .setName('member')
                        .setDescription('Member whose score you want to reset.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcmd2 =>
            subcmd2
                .setName('allmemberscore')
                .setDescription('[DEVELOPER ONLY] - Reset score of all members in this guild.')
        )
        .addSubcommand(subcmd3 =>
            subcmd3
                .setName('allmemberauxiliary')
                .setDescription('[DEVELOPER ONLY] - Reset auxiliaries of all members in this guild.')
        ),
    async execute(interaction) {
        const coreLib = require(dirname + '/assets/library/core.js');
        const config = coreLib.load();
        if (interaction.user.id === config.owner || config.trusted.includes(interaction.user.id)) {
            const gameLib = require(dirname + '/assets/library/game.js');
            if (interaction.options.getSubcommand() === 'memberscore') {
                const target = interaction.options.getUser('member');
                const userID = target.id;
                const sentEmbed = new Discord.EmbedBuilder()
                    .setDescription(`This will delete <@${userID}> score. Are you sure you want to proceed?`)
                interaction.reply({
                    embeds: [sentEmbed],
                    components: [new Discord.ActionRowBuilder()
                        .addComponents(
                            new Discord.ButtonBuilder()
                                .setCustomId('True')
                                .setLabel('Proceed')
                                .setEmoji('⚠️')
                                .setStyle('Success')
                        )],
                    ephemeral: true
                });
                let executed = false;
                const filter = (interaction) => interaction.isButton();
                const collector = interaction.channel.createMessageComponentCollector({ filter, time: 5000 });
                collector.on('collect', async (subInteraction) => {
                    gameLib.resetScore(userID);
                    executed = true;
                    interaction.editReply({
                        embeds: [sentEmbed.setFooter({ text: "Task completed." })],
                        components: []
                    });
                });
                collector.on('end', () => {
                    if (!executed)
                        interaction.editReply({
                            embeds: [sentEmbed.setFooter({ text: "Request cancelled." })],
                            components: []
                        });
                });
            } else if (interaction.options.getSubcommand() === 'allmemberscore') {
                const sentEmbed = new Discord.EmbedBuilder()
                    .setDescription(`This will delete all members scores. Are you sure you want to proceed?`)
                interaction.reply({
                    embeds: [sentEmbed],
                    components: [new Discord.ActionRowBuilder()
                        .addComponents(
                            new Discord.ButtonBuilder()
                                .setCustomId('True')
                                .setLabel('Proceed')
                                .setEmoji('⚠️')
                                .setStyle('Success')
                        )],
                    ephemeral: true
                });
                let executed = false;
                const filter = (interaction) => interaction.isButton();
                const collector = interaction.channel.createMessageComponentCollector({ filter, time: 5000 });
                collector.on('collect', async (subInteraction) => {
                    gameLib.allDataDelete("score");
                    executed = true;
                    interaction.editReply({
                        embeds: [sentEmbed.setFooter({ text: "Task completed." })],
                        components: []
                    });
                });
                collector.on('end', () => {
                    if (!executed)
                        interaction.editReply({
                            embeds: [sentEmbed.setFooter({ text: "Request cancelled." })],
                            components: []
                        });
                });
            } else if (interaction.options.getSubcommand() === 'allmemberauxiliary') {
                const sentEmbed = new Discord.EmbedBuilder()
                    .setDescription(`This will delete all members auxiliaries. Are you sure you want to proceed?`)
                interaction.reply({
                    embeds: [sentEmbed],
                    components: [new Discord.ActionRowBuilder()
                        .addComponents(
                            new Discord.ButtonBuilder()
                                .setCustomId('True')
                                .setLabel('Proceed')
                                .setEmoji('⚠️')
                                .setStyle('Success')
                        )],
                    ephemeral: true
                });
                let executed = false;
                const filter = (interaction) => interaction.isButton();
                const collector = interaction.channel.createMessageComponentCollector({ filter, time: 5000 });
                collector.on('collect', async (subInteraction) => {
                    gameLib.allDataDelete("boost");
                    executed = true;
                    interaction.editReply({
                        embeds: [sentEmbed.setFooter({ text: "Task completed." })],
                        components: []
                    });
                });
                collector.on('end', () => {
                    if (!executed)
                        interaction.editReply({
                            embeds: [sentEmbed.setFooter({ text: "Request cancelled." })],
                            components: []
                        });
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
