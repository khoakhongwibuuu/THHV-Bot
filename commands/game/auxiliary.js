const Discord = require('discord.js');
const dirname = global.dirname;
const stdlib = global.stdlib;

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('auxiliary')
        .setDescription('View your auxiliaries status or anyone else.')
        .addUserOption(option =>
            option.setName('member')
                .setDescription('Member whose auxiliaries you want to view.')
                .setRequired(false)),
    async execute(interaction) {
        const gameLib = require(dirname + '/assets/library/game.js');
        const serverLib = require(dirname + '/assets/library/server.js');
        if (interaction.guildId === serverLib.load().guildID) {
            const target = interaction.options.getUser('member') ?? interaction.user;
            const userID = target.id;
            const double = gameLib.hasBoost(userID, "twice");
            const immune = gameLib.hasBoost(userID, "saver");

            interaction.reply({
                embeds: [new Discord.EmbedBuilder()
                    .setDescription(`<@${userID}>'s auxiliaries:\n` + ` ${double | 0} unused \`Double Reward\`\n` + ` ${immune | 0} unused \`Immunity\`\n`)
                ]
            });
        } else {
            interaction.reply({
                content: "This command cannot be used outside THHV.",
                ephemeral: true
            });
        }
    },
};