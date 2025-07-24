// Packages
const Discord = require('discord.js');
const { gameLib } = global.customLib;

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('mc-scoreboard')
        .setDescription('View the top players of Trivia game in this server.')
        .addIntegerOption(option =>
            option.setName("number-of-players")
                .setDescription("The number of players to be displayed.")
                .setRequired(false)
        )
        .setDMPermission(false)
    ,
    async execute(interaction) {
        if (!gameLib.isSetup(interaction.guild.id)) {
            await interaction.reply({ content: "⚠️ Không tìm thấy dữ liệu của server này.", ephemeral: true });
            return;
        }
        const numOfEntries = interaction.options.getInteger('number-of-players') ?? 5;
        if (numOfEntries < 1 || numOfEntries > 10) {
            await interaction.reply({ content: "⚠️ Số lượng người chơi tối thiểu là 1 và tối đa là 10.", ephemeral: true });
            return;
        }
        let rawmap = new Map();
        const playerdata = gameLib.loadGuildFile(interaction.guild.id).playerdata;
        Object.keys(playerdata).forEach(key => rawmap.set(key, playerdata[key].score.lastValue()));
        const sortedEntries = Array.from(rawmap.entries()).sort((a, b) => b[1] - a[1]);
        if (sortedEntries.length === 0) {
            await interaction.reply({ content: "🔍 Chưa có người chơi nào ghi điểm.", ephemeral: true });
            return;
        }
        const lim = Math.min(sortedEntries.length, numOfEntries);
        const topList = new Map(sortedEntries.slice(0, lim));
        let content = ``;
        const sentEmbed = new Discord.EmbedBuilder();
        sentEmbed.setTitle(`Danh sách ${lim} người chơi có điểm MultipleChoice cao nhất server.`);
        sentEmbed.setFooter({ text: `Đang hiển thị ${lim} trong tổng số ${sortedEntries.length} người chơi đã ghi điểm.` });
        topList.forEach((v, k) => content += `* <@${k}> : \`${v} điểm\`.\n`);
        sentEmbed.setDescription(content);
        await interaction.reply({ embeds: [sentEmbed], ephemeral: !gameLib.isInRoom(interaction.guild.id, interaction.channel.id) | gameLib.isRunning(interaction.guild.id) });
    },
};
