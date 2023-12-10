const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const dirname = global.dirname;
const stdlib = global.stdlib;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('score')
        .setDescription('View your score or anyone else.')
        .addUserOption(option =>
            option.setName('member')
                .setDescription('Member whose scores you want to view.')
                .setRequired(false)),
    async execute(interaction) {
        const gameLib = require(dirname + '/assets/library/game.js');
        const serverLib = require(dirname + '/assets/library/server.js');
        if (interaction.guildId === serverLib.load().guildID) {
            const target = interaction.options.getUser('member') ?? interaction.user;
            const userID = target.id;
            const loadedData = gameLib.readScore(userID);
            if (loadedData !== "Unknown") {
                const embed = new EmbedBuilder();
                interaction.reply({
                    embeds: [embed
                        .setDescription(`<@${userID}> : \`${loadedData.lastValue()}\``)
                    ]
                });
            } else {
                interaction.reply({
                    content: `${(userID === interaction.user.id) ? 'Your ' : `<@${userID}>'s `}data is not found in the database.`,
                    ephemeral: true
                });
            }
        } else {
            interaction.reply({
                content: "This command cannot be used outside THHV.",
                ephemeral: true
            });
        }
    },
};