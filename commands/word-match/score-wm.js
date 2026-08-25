// Packages
const Discord = require('discord.js');
const wordLib = require('#modules/word-match/lib/wordLib.js');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('wm-score')
        .setDescription('View your WordMatch game score or anyone else.')
        .addUserOption(option =>
            option.setName("member")
                .setDescription("Member whose score you want to view")
                .setRequired(false)
        )
        .setDMPermission(false)
    ,
    async execute(interaction) {
        if (!await wordLib.isSetup(interaction.guild.id)) {
            interaction.reply({ content: "🔍 Không tìm thấy dữ liệu của server này.", ephemeral: true });
            return;
        }

        const targetUser = interaction.options.getUser('member') ?? interaction.user;
        const targetScore = await wordLib.readPlayerScore(interaction.guild.id, targetUser.id);

        if (!targetScore) {
            await interaction.reply({
                embeds: [new Discord.EmbedBuilder().setDescription(`<@${targetUser.id}>: Không tìm thấy dữ liệu.`)],
                ephemeral: !await wordLib.isInRoom(interaction.guild.id, interaction.channel.id)
            });
            return;
        }

        await interaction.reply({
            embeds: [new Discord.EmbedBuilder().setDescription(`<@${targetUser.id}>: ${targetScore.lastValue()} điểm.`)],
            ephemeral: !await wordLib.isInRoom(interaction.guild.id, interaction.channel.id)
        });
    },
};
