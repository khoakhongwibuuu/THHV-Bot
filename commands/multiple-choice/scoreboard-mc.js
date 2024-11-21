// Packages
const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');

// Universal
const dirname = global.dirname;
const stdlib = global.stdlib;
const discordAPI = global.discordAPI;

// Module Specified
const mcLib = require(path.join(dirname, 'modules/multiple-choice/lib/gameLib.js'));

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('mc-scoreboard')
        .setDescription('View the top players of MultipleChoice game in this server.')
        .addIntegerOption(option =>
            option.setName("number-of-players")
                .setDescription("The number of players to be displayed.")
                .setRequired(false)
        )
        .setDMPermission(false)
    ,
    async execute(interaction) {
        if (!mcLib.isSetup(interaction.guild.id)) {
            interaction.reply({ content: "⚠️ Không tìm thấy dữ liệu của server này.", ephemeral: true });
            return;
        }
        if (interaction.channel.id !== mcLib.getRoomId(interaction.guild.id)) {
            interaction.reply({ content: `⚠️ Vui lòng sử dụng lệnh tại phòng chơi <#${mcLib.getRoomId(interaction.guild.id)}>`, ephemeral: true });
            return;
        }
        const numOfEntries = interaction.options.getInteger('number-of-players') ?? 5;
        if (numOfEntries < 1 || numOfEntries > 10) {
            interaction.reply({ content: "⚠️ Số lượng người chơi tối thiểu là 1 và tối đa là 10.", ephemeral: true });
            return;
        }
        let rawmap = new Map();
        const playerdata = mcLib.loadGuildFile(interaction.guild.id).playerdata;
        Object.keys(playerdata).forEach(key => rawmap.set(key, playerdata[key].score.lastValue()));
        const sortedEntries = Array.from(rawmap.entries()).sort((a, b) => b[1] - a[1]);
        if (sortedEntries.length === 0) {
            interaction.reply({ content: "🔍 Chưa có người chơi nào ghi điểm.", ephemeral: true });
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
        interaction.reply({ embeds: [sentEmbed], ephemeral: false });
    },
};
