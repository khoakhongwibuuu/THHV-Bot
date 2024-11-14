// Packages
const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');

// Universal
const dirname = global.dirname;
const stdlib = global.stdlib;
const discordAPI = global.discordAPI;

// Module Specified
const wordLib = require(path.join(dirname, 'modules/word-match/lib/wordLib.js'));

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('wm-scoreboard')
        .setDescription('View the top players of WordMatch game in this server.')
        .addIntegerOption(option =>
            option.setName("number-of-players")
                .setDescription("The number of players to be displayed.")
                .setRequired(false)
        )
        .setDMPermission(false)
    ,
    async execute(interaction) {
        if (interaction.channel.type === Discord.ChannelType.DM || interaction.channel.type === Discord.ChannelType.GroupDM) {
            interaction.reply({
                content: "⚠️ This command cannot be used in Direct Messages.",
                ephemeral: true
            });
            return;
        }
        
        if (!wordLib.isSetup(interaction.guild.id)) {
            interaction.reply({ content: "🔍 Không tìm thấy dữ liệu của server này.", ephemeral: true });
            return;
        }
        const numOfEntries = interaction.options.getInteger('number-of-players') ?? 5;
        if (numOfEntries < 1 || numOfEntries > 10) {
            interaction.reply({ content: "⚠️ Số lượng người chơi tối thiểu là 1 và tối đa là 10.", ephemeral: true });
            return;
        }
        let rawmap = new Map();
        const playerdata = wordLib.loadGuildFile(interaction.guild.id).playerScore;
        Object.keys(playerdata).forEach(key => rawmap.set(key, playerdata[key].lastValue()));
        const sortedEntries = Array.from(rawmap.entries()).sort((a, b) => b[1] - a[1]);
        if (sortedEntries.length === 0) {
            interaction.reply({ content: "🔍 Chưa có người chơi nào ghi điểm.", ephemeral: true });
            return;
        }
        const lim = Math.min(sortedEntries.length, numOfEntries);
        const topList = new Map(sortedEntries.slice(0, lim));
        let content = ``;
        const sentEmbed = new Discord.EmbedBuilder();
        sentEmbed.setTitle(`Danh sách ${lim} người chơi có điểm wordMatch cao nhất server.`);
        sentEmbed.setFooter({ text: `Đang hiển thị ${lim} trong tổng số ${sortedEntries.length} người chơi đã ghi điểm.` });
        topList.forEach((v, k) => {
            content += `* <@${k}> : \`${v} điểm\`.\n`
        });
        sentEmbed.setDescription(content);
        interaction.reply({
            embeds: [sentEmbed],
            ephemeral: !wordLib.isInRoom(interaction.guild.id, interaction.channel.id)
        });
    },
};
