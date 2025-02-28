// Packages
const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');

// Module Specified
const wordLib = require(path.join(global.dirname, 'modules/word-match/lib/wordLib.js'));

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('wm-export')
        .setDescription('[Moderators Only] - Export this server word-match data.')
        .setDMPermission(false)
    ,
    async execute(interaction) {
        if (!global.discordAPI.isModerator(interaction.guild.id, interaction.user.id)) {
            interaction.reply({ content: "🚫 Bạn không có quyền sử dụng lệnh này.", ephemeral: true });
            return;
        }
        if (!wordLib.isSetup(interaction.guild.id)) {
            interaction.reply({ content: "⚠️ Không tìm thấy dữ liệu của server này.", ephemeral: true });
            return;
        }
        if (interaction.channel.id !== wordLib.getRoomId(interaction.guild.id)) {
            interaction.reply({ content: `⚠️ Vui lòng sử dụng lệnh tại phòng chơi <#${wordLib.getRoomId(interaction.guild.id)}>`, ephemeral: true });
            return;
        }
        const dat = wordLib.loadRawGuildFile(interaction.guild.id);
        const sentText = null;
        interaction.reply({
            embeds: [new Discord.EmbedBuilder()
                .setDescription(`Server data. Required by <@${interaction.user.id}>\n\`\`\`${dat}\`\`\``)
            ],
            ephemeral: true
        });
    },
};
